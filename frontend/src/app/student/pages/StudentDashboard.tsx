import { useState, useEffect } from 'react';
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
import { studentsApi, professorsApi, groupsApi, notificationsApi } from '../../../api';
import type { StudentWithUser, ProfessorWithUser, Group } from '../../../api/types';
import type { Notification } from '../../../api/notifications';
import { processCommand } from '../utils/chatProcessor';
import { colors, primaryButton } from '../styles/styles';

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
      content: 'Hi! I can help you find students, groups, or professors. Try asking me something like "show me students with Python skills" or "find groups looking for React developers"!'
    }
  ]);
  
  // Data states
  const [students, setStudents] = useState<StudentWithUser[]>([]);
  const [professors, setProfessors] = useState<ProfessorWithUser[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [myGroups, setMyGroups] = useState<Group[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Filtered data states
  const [filteredStudents, setFilteredStudents] = useState<StudentWithUser[]>([]);
  const [filteredProfessors, setFilteredProfessors] = useState<ProfessorWithUser[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<Group[]>([]);
  
  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [hasGroup, setHasGroup] = useState(false);

  // Current student ID
  const [currentStudentId, setCurrentStudentId] = useState<number | null>(null);
  const [groupLeaderNames, setGroupLeaderNames] = useState<Map<number, string>>(new Map());

  // Fetch all data on mount
  useEffect(() => {
    fetchAllData();
  }, [user]);

  const fetchAllData = async () => {
    try {
      setIsLoading(true);
      
      const [studentsData, professorsData, groupsData] = await Promise.all([
        studentsApi.getAll(),
        professorsApi.getAll(),
        groupsApi.getAll()
      ]);

      // Find current student
      let currentStudent = null;
      if (user) {
        currentStudent = studentsData.find(s => s.user_id === user.id);
        if (currentStudent) {
          setCurrentStudentId(currentStudent.id);
        }
      }

      // Create a map of student IDs to names
      const studentNameMap = new Map(studentsData.map(s => [s.id, s.name]));
      
      // Create leader name map
      const leaderMap = new Map<number, string>();
      groupsData.forEach(group => {
        const leaderName = studentNameMap.get(group.leader_id) || 'Unknown Leader';
        leaderMap.set(group.id, leaderName);
      });
      setGroupLeaderNames(leaderMap);

      // Filter out current student
      const filteredStudentsData = currentStudent 
        ? studentsData.filter(s => s.id !== currentStudent.id)
        : studentsData;

      setStudents(studentsData);
      setProfessors(professorsData);
      setGroups(groupsData);
      
      setFilteredStudents(filteredStudentsData);
      setFilteredProfessors(professorsData);
      setFilteredGroups(groupsData);

      if (currentStudent) {
        // Fetch user's groups (where they are a member)
        const myGroupsData = await groupsApi.getMyGroups();
        setMyGroups(myGroupsData);
        
        // Check if user leads a group
        const leadsGroup = groupsData.some(g => g.leader_id === currentStudent.id);
        setHasGroup(leadsGroup);

        // Fetch notifications
        await fetchNotifications();
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const [notifs, countData] = await Promise.all([
        notificationsApi.getAll(0, 50, false),
        notificationsApi.getUnreadCount()
      ]);
      setNotifications(notifs);
      setUnreadCount(countData.count);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const handleSendMessage = (message: string) => {
    const newMessages: Message[] = [...chatMessages, { role: 'user', content: message }];

    const mockDataStudents = students.map(s => ({
      id: s.id,
      name: s.name,
      email: s.email,
      gpa: s.gpa,
      major: s.major,
      skills: s.skills,
      bio: s.bio || '',
      lookingForGroup: s.looking_for_group,
      year: s.year
    }));

    const mockDataGroups = filteredGroups.map(g => ({
      id: g.id,
      name: g.name,
      leaderId: g.leader_id,
      leaderName: groupLeaderNames.get(g.id) || 'Leader',
      description: g.description,
      neededSkills: g.needed_skills,
      currentMembers: g.current_members,
      maxMembers: g.max_members,
      hasMentor: g.has_mentor,
      mentorName: undefined
    }));

    const mockDataProfessors = professors.map(p => ({
      id: p.id,
      name: p.name,
      email: p.email,
      department: p.department,
      researchAreas: p.research_areas,
      availableSlots: p.available_slots,
      totalSlots: p.total_slots
    }));

    const { response, students: filteredStds, professors: filteredProfs, switchTab } = processCommand(
      message,
      mockDataStudents,
      mockDataGroups,
      mockDataProfessors
    );

    const filteredStudentsResult = filteredStds
      .map(s => students.find(std => std.id === s.id))
      .filter((s): s is StudentWithUser => s !== undefined);

    const filteredProfessorsResult = filteredProfs
      .map(p => professors.find(prof => prof.id === p.id))
      .filter((p): p is ProfessorWithUser => p !== undefined);

    setFilteredStudents(filteredStudentsResult);
    setFilteredProfessors(filteredProfessorsResult);
    
    if (switchTab) {
      setActiveTab(switchTab);
    }

    newMessages.push({ role: 'assistant', content: response });
    setChatMessages(newMessages);
  };

  const handleStudentInvite = async (studentId: number) => {
    if (!currentStudentId || myGroups.length === 0) {
      setChatMessages([
        ...chatMessages,
        {
          role: 'assistant',
          content: 'You need to create a group first before inviting students!'
        }
      ]);
      return;
    }

    try {
      await groupsApi.invitations.create({
        group_id: myGroups[0].id,
        student_id: studentId,
        message: 'Would you like to join our research group?'
      });

      const student = students.find(s => s.id === studentId);
      setChatMessages([
        ...chatMessages,
        {
          role: 'assistant',
          content: `Invitation sent to ${student?.name || 'student'} successfully!`
        }
      ]);
    } catch (error) {
      console.error('Failed to send invitation:', error);
      setChatMessages([
        ...chatMessages,
        {
          role: 'assistant',
          content: 'Failed to send invitation. Please try again.'
        }
      ]);
    }
  };

  const handleGroupJoinRequest = async (groupId: number) => {
    if (!currentStudentId) {
      alert('Student ID not found');
      return;
    }

    const group = groups.find(g => g.id === groupId);
    
    // Check if user is the leader
    if (group && group.leader_id === currentStudentId) {
      setChatMessages([
        ...chatMessages,
        {
          role: 'assistant',
          content: `You are already the leader of "${group.name}"!`
        }
      ]);
      return;
    }

    // Check if user is already a member of this group
    const isAlreadyMember = myGroups.some(g => g.id === groupId);
    if (isAlreadyMember) {
      setChatMessages([
        ...chatMessages,
        {
          role: 'assistant',
          content: `You are already a member of "${group?.name}"! Check the My Groups tab.`
        }
      ]);
      return;
    }

    try {
      await groupsApi.joinRequests.create({
        group_id: groupId,
        student_id: currentStudentId,
        message: 'I would like to join your research group.'
      });

      setChatMessages([
        ...chatMessages,
        {
          role: 'assistant',
          content: `Join request sent successfully!`
        }
      ]);
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to send join request.';
      setChatMessages([
        ...chatMessages,
        {
          role: 'assistant',
          content: errorMessage
        }
      ]);
    }
  };

  const handleProfessorMentorshipRequest = (professorId: number) => {
    const professor = professors.find(p => p.id === professorId);
    setChatMessages([
      ...chatMessages,
      {
        role: 'assistant',
        content: `Mentorship request sent to ${professor?.name || 'professor'} successfully!`
      }
    ]);
  };

  const handleCreateGroup = async (groupData: {
    name: string;
    description: string;
    neededSkills: string[];
    maxMembers: number;
  }) => {
    if (!currentStudentId) {
      alert('Student ID not found');
      return;
    }

    try {
      const newGroup = await groupsApi.create({
        name: groupData.name,
        leader_id: currentStudentId,
        description: groupData.description,
        needed_skills: groupData.neededSkills,
        max_members: groupData.maxMembers
      });

      setMyGroups([newGroup, ...myGroups]);
      setHasGroup(true);
      setIsCreateModalOpen(false);

      setChatMessages([
        ...chatMessages,
        {
          role: 'assistant',
          content: `Your group "${groupData.name}" has been created successfully!`
        }
      ]);
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to create group.';
      alert(errorMessage);
    }
  };

  const handleDeleteGroup = async (groupId: number) => {
    const group = myGroups.find(g => g.id === groupId);
    if (window.confirm(`Are you sure you want to delete "${group?.name}"?`)) {
      try {
        await groupsApi.delete(groupId);
        setMyGroups(myGroups.filter(g => g.id !== groupId));
        setHasGroup(false);
        setChatMessages([
          ...chatMessages,
          {
            role: 'assistant',
            content: `The group "${group?.name}" has been deleted.`
          }
        ]);
      } catch (error) {
        alert('Failed to delete group.');
      }
    }
  };

  const handleLeaveGroup = async (groupId: number) => {
    const group = myGroups.find(g => g.id === groupId);
    if (window.confirm(`Are you sure you want to leave "${group?.name}"?`)) {
      try {
        if (currentStudentId) {
          await groupsApi.removeMember(groupId, currentStudentId);
          setMyGroups(myGroups.filter(g => g.id !== groupId));
          setChatMessages([
            ...chatMessages,
            {
              role: 'assistant',
              content: `You've left "${group?.name}".`
            }
          ]);
        }
      } catch (error) {
        alert('Failed to leave group.');
      }
    }
  };

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        fontSize: '1.5rem',
        color: '#667eea'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif', backgroundColor: colors.neutral.gray100 }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <DashboardHeader 
          userName={user?.name || 'User'} 
          onLogout={logout}
          notifications={notifications}
          unreadCount={unreadCount}
          onNotificationClick={async (notificationId) => {
            await notificationsApi.markOneRead(notificationId);
            await fetchNotifications();
          }}
          onNotificationAction={async (notificationId, action) => {
            try {
              const notification = notifications.find(n => n.id === notificationId);
              if (!notification) return;

              if (notification.type === 'group_invitation') {
                await notificationsApi.handleGroupInvitation(notificationId, action);
              } else if (notification.type === 'join_request') {
                await notificationsApi.handleGroupJoinRequest(notificationId, action);
              }
              
              // Remove notification from the list immediately
              setNotifications(notifications.filter(n => n.id !== notificationId));
              setUnreadCount(Math.max(0, unreadCount - 1));
            } catch (error) {
              console.error('Failed to handle notification action:', error);
            }
          }}
        />
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        <div style={{ flex: 1, overflow: 'auto', padding: '2rem' }}>
          {/* Students Tab */}
          {activeTab === 'students' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
              {filteredStudents.map((student) => (
                <StudentCard 
                  key={student.id} 
                  student={{
                    id: student.id,
                    name: student.name,
                    email: student.email,
                    gpa: student.gpa,
                    major: student.major,
                    skills: student.skills,
                    bio: student.bio || '',
                    lookingForGroup: student.looking_for_group,
                    year: student.year
                  }} 
                  onInvite={handleStudentInvite} 
                />
              ))}
            </div>
          )}

          {/* Groups Tab */}
          {activeTab === 'groups' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
              {filteredGroups.map((group) => {
                // Check if user is already a member of this group
                const isAlreadyMember = myGroups.some(g => g.id === group.id);
                const isLeader = group.leader_id === currentStudentId;
                
                return (
                  <GroupCard 
                    key={group.id} 
                    group={{
                      id: group.id,
                      name: group.name,
                      leaderId: group.leader_id,
                      leaderName: groupLeaderNames.get(group.id) || 'Unknown',
                      description: group.description,
                      neededSkills: group.needed_skills,
                      currentMembers: group.current_members,
                      maxMembers: group.max_members,
                      hasMentor: group.has_mentor,
                      mentorName: undefined
                    }} 
                    onJoinRequest={handleGroupJoinRequest}
                    currentStudentId={currentStudentId || undefined}
                    isAlreadyMember={isAlreadyMember}
                    isLeader={isLeader}
                  />
                );
              })}
            </div>
          )}

          {/* Professors Tab */}
          {activeTab === 'professors' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
              {filteredProfessors.map((prof) => (
                <ProfessorCard 
                  key={prof.id} 
                  professor={{
                    id: prof.id,
                    name: prof.name,
                    email: prof.email,
                    department: prof.department,
                    researchAreas: prof.research_areas,
                    availableSlots: prof.available_slots,
                    totalSlots: prof.total_slots
                  }} 
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
                    Groups you're a member of
                  </p>
                </div>
                {!hasGroup && (
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    style={{ ...primaryButton, padding: '0.75rem 1.25rem' }}
                  >
                    <Plus size={18} />
                    Create New Group
                  </button>
                )}
              </div>

              {myGroups.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 2rem', background: colors.neutral.white, borderRadius: '16px', border: `2px dashed ${colors.neutral.gray200}` }}>
                  <h3 style={{ margin: '0 0 0.5rem 0' }}>No groups yet</h3>
                  <p style={{ margin: '0 0 1.5rem 0', color: colors.neutral.gray600 }}>
                    Create or join a research group
                  </p>
                  {!hasGroup && (
                    <button onClick={() => setIsCreateModalOpen(true)} style={primaryButton}>
                      <Plus size={18} />
                      Create Your First Group
                    </button>
                  )}
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                  {myGroups.map((group) => (
                    <MyGroupCard
                      key={group.id}
                      currentStudentId={currentStudentId || undefined}
                      group={{
                        id: group.id,
                        name: group.name,
                        leaderId: group.leader_id,
                        leaderName: groupLeaderNames.get(group.id) || 'Leader',
                        description: group.description,
                        neededSkills: group.needed_skills,
                        currentMembers: group.current_members,
                        maxMembers: group.max_members,
                        hasMentor: group.has_mentor,
                        mentorName: undefined,
                        members: []
                      }}
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

      <ChatSidebar messages={chatMessages} onSendMessage={handleSendMessage} />
      
      {!hasGroup && (
        <CreateGroupModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateGroup}
        />
      )}
    </div>
  );
}