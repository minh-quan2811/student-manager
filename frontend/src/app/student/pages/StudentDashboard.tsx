// frontend/src/app/student/pages/StudentDashboard.tsx
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useAuth } from '../../../auth/AuthContext';
import DashboardHeader from '../components/DashboardHeader';
import TabNavigation from '../components/TabNavigation';
import StudentCard from '../components/StudentCard';
import GroupCard from '../components/GroupCard';
import ProfessorCard from '../components/ProfessorCard';
import MyGroupCard from '../components/MyGroupCard';
import ChatSidebar from '../components/ChatSidebar';
import CreateGroupModal from '../components/CreateGroupModal';
import { 
  mockStudents, 
  mockGroups, 
  mockProfessors, 
  mockMyGroups,
  mockInvitations,
  CURRENT_USER_ID,
  CURRENT_USER_NAME
} from '../data/mockData';
import { processCommand } from '../utils/chatProcessor';
import { colors, primaryButton } from '../styles/styles';
import type { Group, GroupInvitation } from '../data/mockData';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

type TabType = 'students' | 'groups' | 'professors' | 'mygroups';

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
  const [myGroups, setMyGroups] = useState<Group[]>(mockMyGroups);
  const [invitations, setInvitations] = useState<GroupInvitation[]>(mockInvitations);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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

  const handleAcceptInvitation = (invitationId: number) => {
    const invitation = invitations.find(inv => inv.id === invitationId);
    if (!invitation) return;

    // Update invitation status
    setInvitations(invitations.map(inv => 
      inv.id === invitationId ? { ...inv, status: 'accepted' as const } : inv
    ));

    // Find the group and add to my groups
    const group = mockGroups.find(g => g.id === invitation.groupId);
    if (group) {
      const newGroup = {
        ...group,
        currentMembers: group.currentMembers + 1,
        members: [
          ...(group.members || []),
          {
            id: CURRENT_USER_ID,
            name: CURRENT_USER_NAME,
            role: 'member' as const,
            joinedAt: new Date().toISOString().split('T')[0]
          }
        ]
      };
      setMyGroups([...myGroups, newGroup]);
    }

    setChatMessages([
      ...chatMessages,
      {
        role: 'assistant',
        content: `You've successfully joined "${invitation.groupName}"! Check the My Groups tab to see your new group.`
      }
    ]);
  };

  const handleRejectInvitation = (invitationId: number) => {
    const invitation = invitations.find(inv => inv.id === invitationId);
    
    setInvitations(invitations.map(inv => 
      inv.id === invitationId ? { ...inv, status: 'rejected' as const } : inv
    ));

    setChatMessages([
      ...chatMessages,
      {
        role: 'assistant',
        content: `You've declined the invitation to "${invitation?.groupName}".`
      }
    ]);
  };

  const handleCreateGroup = (groupData: {
    name: string;
    description: string;
    neededSkills: string[];
    maxMembers: number;
  }) => {
    const newGroup: Group = {
      id: Date.now(),
      name: groupData.name,
      leaderId: CURRENT_USER_ID,
      leaderName: CURRENT_USER_NAME,
      description: groupData.description,
      neededSkills: groupData.neededSkills,
      currentMembers: 1,
      maxMembers: groupData.maxMembers,
      hasMentor: false,
      members: [
        {
          id: CURRENT_USER_ID,
          name: CURRENT_USER_NAME,
          role: 'leader',
          joinedAt: new Date().toISOString().split('T')[0]
        }
      ]
    };

    setMyGroups([newGroup, ...myGroups]);
    setIsCreateModalOpen(false);

    setChatMessages([
      ...chatMessages,
      {
        role: 'assistant',
        content: `Great! Your group "${groupData.name}" has been created successfully. You can manage it in the My Groups tab.`
      }
    ]);
  };

  const handleEditGroup = (groupId: number) => {
    const group = myGroups.find(g => g.id === groupId);
    setChatMessages([
      ...chatMessages,
      {
        role: 'assistant',
        content: `Edit functionality for "${group?.name}" would open here. This feature can be implemented similar to the create modal.`
      }
    ]);
  };

  const handleDeleteGroup = (groupId: number) => {
    const group = myGroups.find(g => g.id === groupId);
    if (confirm(`Are you sure you want to delete "${group?.name}"? This action cannot be undone.`)) {
      setMyGroups(myGroups.filter(g => g.id !== groupId));
      setChatMessages([
        ...chatMessages,
        {
          role: 'assistant',
          content: `The group "${group?.name}" has been deleted successfully.`
        }
      ]);
    }
  };

  const handleLeaveGroup = (groupId: number) => {
    const group = myGroups.find(g => g.id === groupId);
    if (confirm(`Are you sure you want to leave "${group?.name}"?`)) {
      setMyGroups(myGroups.filter(g => g.id !== groupId));
      setChatMessages([
        ...chatMessages,
        {
          role: 'assistant',
          content: `You've successfully left the group "${group?.name}".`
        }
      ]);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        backgroundColor: colors.neutral.gray100
      }}
    >
      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <DashboardHeader 
          userName={user?.name || 'User'} 
          onLogout={logout}
          invitations={invitations}
          onAcceptInvitation={handleAcceptInvitation}
          onRejectInvitation={handleRejectInvitation}
        />
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

          {/* My Groups Tab */}
          {activeTab === 'mygroups' && (
            <>
              <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: colors.neutral.gray900 }}>
                    My Groups
                  </h2>
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: colors.neutral.gray600 }}>
                    Manage your research groups
                  </p>
                </div>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  style={{
                    ...primaryButton,
                    padding: '0.75rem 1.25rem'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = `0 6px 20px ${colors.primary.shadowHover}`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = `0 4px 12px ${colors.primary.shadow}`;
                  }}
                >
                  <Plus size={18} />
                  Create New Group
                </button>
              </div>

              {myGroups.length === 0 ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '4rem 2rem',
                    background: colors.neutral.white,
                    borderRadius: '16px',
                    border: `2px dashed ${colors.neutral.gray200}`
                  }}
                >
                  <div style={{
                    width: '80px',
                    height: '80px',
                    background: colors.neutral.gray100,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem'
                  }}>
                    <Plus size={40} style={{ color: colors.neutral.gray400 }} />
                  </div>
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', fontWeight: 'bold', color: colors.neutral.gray900 }}>
                    No groups yet
                  </h3>
                  <p style={{ margin: '0 0 1.5rem 0', fontSize: '0.875rem', color: colors.neutral.gray600 }}>
                    Create your first research group to start collaborating
                  </p>
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    style={{
                      ...primaryButton,
                      padding: '0.75rem 1.5rem'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = `0 6px 20px ${colors.primary.shadowHover}`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = `0 4px 12px ${colors.primary.shadow}`;
                    }}
                  >
                    <Plus size={18} />
                    Create Your First Group
                  </button>
                </div>
              ) : (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                    gap: '1.5rem'
                  }}
                >
                  {myGroups.map((group) => (
                    <MyGroupCard
                      key={group.id}
                      group={group}
                      onEdit={handleEditGroup}
                      onDelete={handleDeleteGroup}
                      onLeave={handleLeaveGroup}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Chatbot Sidebar */}
      <ChatSidebar messages={chatMessages} onSendMessage={handleSendMessage} />

      {/* Create Group Modal */}
      <CreateGroupModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateGroup}
      />
    </div>
  );
}