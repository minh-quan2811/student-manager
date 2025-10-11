// frontend/src/app/student/pages/StudentDashboard.tsx
import { useState } from 'react';
import { useAuth } from '../../../auth/AuthContext';
import DashboardHeader from '../components/DashboardHeader';
import TabNavigation from '../components/TabNavigation';
import StudentCard from '../components/StudentCard';
import GroupCard from '../components/GroupCard';
import ProfessorCard from '../components/ProfessorCard';
import ChatSidebar from '../components/ChatSidebar';
import { mockStudents, mockGroups, mockProfessors } from '../data/mockData';
import { processCommand } from '../utils/chatProcessor';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

type TabType = 'students' | 'groups' | 'professors';

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('students');
  const [chatMessages, setChatMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'Hi! I can help you find students, groups, or professors. Try asking me something like "show me students with Python skills" or "find groups looking for React developers"!'
    }
  ]);
  const [filteredStudents, setFilteredStudents] = useState(mockStudents);
  const [filteredGroups, setFilteredGroups] = useState(mockGroups);
  const [filteredProfessors, setFilteredProfessors] = useState(mockProfessors);

  const handleSendMessage = (message: string) => {
    const newMessages: Message[] = [...chatMessages, { role: 'user', content: message }];

    const { response, students, groups, professors, switchTab } = processCommand(
      message,
      mockStudents,
      mockGroups,
      mockProfessors
    );

    setFilteredStudents(students);
    setFilteredGroups(groups);
    setFilteredProfessors(professors);

    if (switchTab) {
      setActiveTab(switchTab);
    }

    newMessages.push({ role: 'assistant', content: response });
    setChatMessages(newMessages);
  };

  const handleStudentInvite = (studentId: number) => {
    const student = mockStudents.find(s => s.id === studentId);
    setChatMessages([
      ...chatMessages,
      {
        role: 'assistant',
        content: `Invitation sent to ${student?.name || 'student'} successfully! They'll be notified about your group.`
      }
    ]);
  };

  const handleGroupJoinRequest = (groupId: number) => {
    const group = mockGroups.find(g => g.id === groupId);
    setChatMessages([
      ...chatMessages,
      {
        role: 'assistant',
        content: `Join request sent to "${group?.name || 'group'}" successfully! The group leader will review your request.`
      }
    ]);
  };

  const handleProfessorMentorshipRequest = (professorId: number) => {
    const professor = mockProfessors.find(p => p.id === professorId);
    setChatMessages([
      ...chatMessages,
      {
        role: 'assistant',
        content: `Mentorship request sent to ${professor?.name || 'professor'} successfully! They will review your application.`
      }
    ]);
  };

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        backgroundColor: '#f3f4f6'
      }}
    >
      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <DashboardHeader userName={user?.name || 'User'} onLogout={logout} />
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Content Area */}
        <div
          style={{
            flex: 1,
            overflow: 'auto',
            padding: '2rem'
          }}
        >
          {/* Students Tab */}
          {activeTab === 'students' && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                gap: '1.5rem'
              }}
            >
              {filteredStudents.map((student) => (
                <StudentCard 
                  key={student.id} 
                  student={student} 
                  onInvite={handleStudentInvite} 
                />
              ))}
            </div>
          )}

          {/* Groups Tab */}
          {activeTab === 'groups' && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                gap: '1.5rem'
              }}
            >
              {filteredGroups.map((group) => (
                <GroupCard 
                  key={group.id} 
                  group={group} 
                  onJoinRequest={handleGroupJoinRequest} 
                />
              ))}
            </div>
          )}

          {/* Professors Tab */}
          {activeTab === 'professors' && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                gap: '1.5rem'
              }}
            >
              {filteredProfessors.map((prof) => (
                <ProfessorCard 
                  key={prof.id} 
                  professor={prof} 
                  onRequestMentorship={handleProfessorMentorshipRequest} 
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chatbot Sidebar */}
      <ChatSidebar messages={chatMessages} onSendMessage={handleSendMessage} />
    </div>
  );
}