// frontend/src/app/professor/pages/ProfessorDashboard.tsx
import { useState, useRef, useEffect } from 'react';
import { Inbox } from 'lucide-react';
import { useAuth } from '../../../auth/AuthContext';
import ProfessorDashboardHeader from '../components/ProfessorDashboardHeader';
import ProfessorTabNavigation from '../components/ProfessorTabNavigation';
import MentorshipRequestCard from '../components/MentorshipRequestCard';
import MentoredGroupCard from '../components/MentoredGroupCard';
import { 
  mockMentorshipRequests,
  mockMentoredGroups,
  CURRENT_PROFESSOR_NAME
} from '../data/mockData';
import { colors } from '../../student/styles/styles';
import type { MentorshipRequest, MentoredGroup } from '../data/mockData';

type TabType = 'requests' | 'mygroups';

export default function ProfessorDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('requests');
  const [requests, setRequests] = useState<MentorshipRequest[]>(mockMentorshipRequests);
  const [mentoredGroups, setMentoredGroups] = useState<MentoredGroup[]>(mockMentoredGroups);
  const [highlightedRequestId, setHighlightedRequestId] = useState<number | null>(null);
  const requestRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  const pendingRequestCount = requests.filter(req => req.status === 'pending').length;

  useEffect(() => {
    if (highlightedRequestId && requestRefs.current[highlightedRequestId]) {
      requestRefs.current[highlightedRequestId]?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
      
      // Remove highlight after animation
      setTimeout(() => {
        setHighlightedRequestId(null);
      }, 2000);
    }
  }, [highlightedRequestId]);

  const handleViewRequest = (requestId: number) => {
    setActiveTab('requests');
    setTimeout(() => {
      setHighlightedRequestId(requestId);
    }, 100);
  };

  const handleAcceptRequest = (requestId: number) => {
    const request = requests.find(req => req.id === requestId);
    if (!request) return;

    // Update request status
    setRequests(requests.map(req => 
      req.id === requestId ? { ...req, status: 'accepted' as const } : req
    ));

    // Add to mentored groups
    const newGroup: MentoredGroup = {
      id: request.groupId,
      name: request.groupName,
      leaderId: request.leaderId,
      leaderName: request.leaderName,
      description: request.description,
      neededSkills: request.neededSkills,
      currentMembers: request.members,
      maxMembers: request.maxMembers,
      members: [
        { 
          id: request.leaderId, 
          name: request.leaderName, 
          role: 'leader', 
          joinedAt: new Date().toISOString().split('T')[0] 
        }
      ],
      startDate: new Date().toISOString().split('T')[0],
      status: 'active'
    };

    setMentoredGroups([newGroup, ...mentoredGroups]);
  };

  const handleRejectRequest = (requestId: number, rejectionNote: string) => {
    setRequests(requests.map(req => 
      req.id === requestId 
        ? { ...req, status: 'rejected' as const, rejectionNote } 
        : req
    ));
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        backgroundColor: colors.neutral.gray100
      }}
    >
      <ProfessorDashboardHeader 
        professorName={user?.name || CURRENT_PROFESSOR_NAME}
        onLogout={logout}
        requests={requests}
        onViewRequest={handleViewRequest}
      />
      
      <ProfessorTabNavigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        requestCount={pendingRequestCount}
      />

      {/* Content Area */}
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '2rem'
        }}
      >
        {/* Mentorship Requests Tab */}
        {activeTab === 'requests' && (
          <>
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: colors.neutral.gray900 }}>
                Mentorship Requests
              </h2>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: colors.neutral.gray600 }}>
                Review and respond to group mentorship requests
              </p>
            </div>

            {requests.length === 0 ? (
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
                  <Inbox size={40} style={{ color: colors.neutral.gray400 }} />
                </div>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', fontWeight: 'bold', color: colors.neutral.gray900 }}>
                  No mentorship requests
                </h3>
                <p style={{ margin: 0, fontSize: '0.875rem', color: colors.neutral.gray600 }}>
                  When groups request your mentorship, they'll appear here
                </p>
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
                  gap: '1.5rem'
                }}
              >
                {requests.map((request) => (
                  <div 
                    key={request.id}
                    ref={(el) => {
                      requestRefs.current[request.id] = el;
                    }}
                    style={{
                      transition: 'all 0.3s ease',
                      ...(highlightedRequestId === request.id && {
                        animation: 'highlight 2s ease-in-out'
                      })
                    }}
                  >
                    <MentorshipRequestCard
                      request={request}
                      onAccept={handleAcceptRequest}
                      onReject={handleRejectRequest}
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* My Mentored Groups Tab */}
        {activeTab === 'mygroups' && (
          <>
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: colors.neutral.gray900 }}>
                My Mentored Groups
              </h2>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: colors.neutral.gray600 }}>
                Groups you are currently mentoring and past mentorships
              </p>
            </div>

            {mentoredGroups.length === 0 ? (
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
                  <Inbox size={40} style={{ color: colors.neutral.gray400 }} />
                </div>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', fontWeight: 'bold', color: colors.neutral.gray900 }}>
                  No mentored groups yet
                </h3>
                <p style={{ margin: 0, fontSize: '0.875rem', color: colors.neutral.gray600 }}>
                  Accept mentorship requests to start guiding research groups
                </p>
              </div>
            ) : (
              <>
                {/* Active Groups */}
                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{ 
                    margin: '0 0 1rem 0', 
                    fontSize: '1.125rem', 
                    fontWeight: 'bold', 
                    color: colors.neutral.gray900,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    Active Groups
                    <span style={{
                      padding: '0.25rem 0.625rem',
                      background: colors.success.light,
                      color: colors.success.text,
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                      border: `2px solid ${colors.success.border}`
                    }}>
                      {mentoredGroups.filter(g => g.status === 'active').length}
                    </span>
                  </h3>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
                      gap: '1.5rem'
                    }}
                  >
                    {mentoredGroups
                      .filter(group => group.status === 'active')
                      .map((group) => (
                        <MentoredGroupCard key={group.id} group={group} />
                      ))}
                  </div>
                </div>

                {/* Completed Groups */}
                {mentoredGroups.filter(g => g.status === 'completed').length > 0 && (
                  <div>
                    <h3 style={{ 
                      margin: '0 0 1rem 0', 
                      fontSize: '1.125rem', 
                      fontWeight: 'bold', 
                      color: colors.neutral.gray900,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      Completed Groups
                      <span style={{
                        padding: '0.25rem 0.625rem',
                        background: colors.neutral.gray100,
                        color: colors.neutral.gray600,
                        borderRadius: '8px',
                        fontSize: '0.75rem',
                        border: `2px solid ${colors.neutral.gray200}`
                      }}>
                        {mentoredGroups.filter(g => g.status === 'completed').length}
                      </span>
                    </h3>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
                        gap: '1.5rem'
                      }}
                    >
                      {mentoredGroups
                        .filter(group => group.status === 'completed')
                        .map((group) => (
                          <MentoredGroupCard key={group.id} group={group} />
                        ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      <style>{`
        @keyframes highlight {
          0%, 100% { box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
          50% { box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.3), 0 8px 30px rgba(245, 158, 11, 0.2); }
        }
      `}</style>
    </div>
  );
}