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
import { studentsApi, professorsApi, groupsApi } from '../../../api';
import type { StudentWithUser, ProfessorWithUser, Group, GroupInvitation } from '../../../api/types';
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
  const [invitations, setInvitations] = useState<GroupInvitation[]>([]);
  
  // Filtered data states
  const [filteredStudents, setFilteredStudents] = useState<StudentWithUser[]>([]);
  const [filteredProfessors, setFilteredProfessors] = useState<ProfessorWithUser[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<Group[]>([]);
  
  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Current student ID
  const [currentStudentId, setCurrentStudentId] = useState<number | null>(null);

  // Fetch all data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch students, professors, and groups in parallel
        const [studentsData, professorsData, groupsData] = await Promise.all([
          studentsApi.getAll(),
          professorsApi.getAll(),
          groupsApi.getAll()
        ]);

        setStudents(studentsData);
        setProfessors(professorsData);
        setGroups(groupsData);
        
        setFilteredStudents(studentsData);
        setFilteredProfessors(professorsData);
        setFilteredGroups(groupsData);

        // Find current student
        if (user) {
          const currentStudent = studentsData.find(s => s.user_id === user.id);
          if (currentStudent) {
            setCurrentStudentId(currentStudent.id);
            
            // Fetch user's groups and invitations
            const userGroups = groupsData.filter(g => 
              g.leader_id === currentStudent.id || 
              // Note: We'll need to check members in a more sophisticated way
              // For now, just filter by leader
              false
            );
            setMyGroups(userGroups);

            // Fetch invitations
            try {
              const invitationsData = await groupsApi.invitations.getForStudent(currentStudent.id);
              setInvitations(invitationsData);
            } catch (error) {
              console.error('Failed to fetch invitations:', error);
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleSendMessage = (message: string) => {
    const newMessages: Message[] = [...chatMessages, { role: 'user', content: message }];

    // Map API types to mockData types for chatProcessor
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
      leaderName: 'Leader',
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

    // Convert mockData results back to API types
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
      // Use the first group for simplicity - in a real app, let user choose
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
          content: `Invitation sent to ${student?.name || 'student'} successfully! They'll be notified about your group.`
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

  const handleGroupJoinRequest = (groupId: number) => {
    const group = groups.find(g => g.id === groupId);
    // In a real implementation, this would create a join request
    setChatMessages([
      ...chatMessages,
      {
        role: 'assistant',
        content: `Join request sent to "${group?.name || 'group'}" successfully! The group leader will review your request.`
      }
    ]);
  };

  const handleProfessorMentorshipRequest = (professorId: number) => {
    const professor = professors.find(p => p.id === professorId);
    // In a real implementation, this would create a mentorship request
    setChatMessages([
      ...chatMessages,
      {
        role: 'assistant',
        content: `Mentorship request sent to ${professor?.name || 'professor'} successfully! They will review your application.`
      }
    ]);
  };

  const handleAcceptInvitation = async (invitationId: number) => {
    try {
      await groupsApi.invitations.updateStatus(invitationId, 'accepted');
      
      // Update local state
      const invitation = invitations.find(inv => inv.id === invitationId);
      if (invitation) {
        setInvitations(invitations.map(inv => 
          inv.id === invitationId ? { ...inv, status: 'accepted' as const } : inv
        ));

        // Refresh groups
        const groupsData = await groupsApi.getAll();
        setGroups(groupsData);
        const userGroups = groupsData.filter(g => g.leader_id === currentStudentId);
        setMyGroups(userGroups);

        const group = groups.find(g => g.id === invitation.group_id);
        setChatMessages([
          ...chatMessages,
          {
            role: 'assistant',
            content: `You've successfully joined "${group?.name}"! Check the My Groups tab to see your new group.`
          }
        ]);
      }
    } catch (error) {
      console.error('Failed to accept invitation:', error);
      setChatMessages([
        ...chatMessages,
        {
          role: 'assistant',
          content: 'Failed to accept invitation. Please try again.'
        }
      ]);
    }
  };

  const handleRejectInvitation = async (invitationId: number) => {
    try {
      await groupsApi.invitations.updateStatus(invitationId, 'rejected');
      
      const invitation = invitations.find(inv => inv.id === invitationId);
      setInvitations(invitations.map(inv => 
        inv.id === invitationId ? { ...inv, status: 'rejected' as const } : inv
      ));

      const group = groups.find(g => g.id === invitation?.group_id);
      setChatMessages([
        ...chatMessages,
        {
          role: 'assistant',
          content: `You've declined the invitation to "${group?.name}".`
        }
      ]);
    } catch (error) {
      console.error('Failed to reject invitation:', error);
    }
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
      setIsCreateModalOpen(false);

      setChatMessages([
        ...chatMessages,
        {
          role: 'assistant',
          content: `Great! Your group "${groupData.name}" has been created successfully. You can manage it in the My Groups tab.`
        }
      ]);
    } catch (error) {
      console.error('Failed to create group:', error);
      alert('Failed to create group. Please try again.');
    }
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

  const handleDeleteGroup = async (groupId: number) => {
    const group = myGroups.find(g => g.id === groupId);
    if (window.confirm(`Are you sure you want to delete "${group?.name}"? This action cannot be undone.`)) {
      try {
        await groupsApi.delete(groupId);
        setMyGroups(myGroups.filter(g => g.id !== groupId));
        setChatMessages([
          ...chatMessages,
          {
            role: 'assistant',
            content: `The group "${group?.name}" has been deleted successfully.`
          }
        ]);
      } catch (error) {
        console.error('Failed to delete group:', error);
        alert('Failed to delete group. Please try again.');
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
              content: `You've successfully left the group "${group?.name}".`
            }
          ]);
        }
      } catch (error) {
        console.error('Failed to leave group:', error);
        alert('Failed to leave group. Please try again.');
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
          invitations={invitations.map(inv => ({
            id: inv.id,
            groupId: inv.group_id,
            groupName: groups.find(g => g.id === inv.group_id)?.name || 'Unknown Group',
            leaderName: 'Leader',
            message: inv.message,
            timestamp: inv.created_at,
            status: inv.status
          }))}
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
                  group={{
                    id: group.id,
                    name: group.name,
                    leaderId: group.leader_id,
                    leaderName: 'Group Leader', // You'd need to fetch this
                    description: group.description,
                    neededSkills: group.needed_skills,
                    currentMembers: group.current_members,
                    maxMembers: group.max_members,
                    hasMentor: group.has_mentor,
                    mentorName: group.mentor_id ? 'Mentor' : undefined
                  }} 
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
                      group={{
                        id: group.id,
                        name: group.name,
                        leaderId: group.leader_id,
                        leaderName: user?.name || 'You',
                        description: group.description,
                        neededSkills: group.needed_skills,
                        currentMembers: group.current_members,
                        maxMembers: group.max_members,
                        hasMentor: group.has_mentor,
                        mentorName: group.mentor_id ? 'Mentor' : undefined,
                        members: []
                      }}
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