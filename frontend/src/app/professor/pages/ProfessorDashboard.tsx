import { useState, useRef, useEffect } from 'react';
import { Inbox, Award } from 'lucide-react';
import { useAuth } from '../../../auth/AuthContext';
import ProfessorDashboardHeader from '../components/ProfessorDashboardHeader';
import ProfessorTabNavigation from '../components/ProfessorTabNavigation';
import MentorshipRequestCard from '../components/MentorshipRequestCard';
import MentoredGroupCard from '../components/MentoredGroupCard';
import { mentorshipApi } from '../../../api/mentorship';
import type { MentorshipRequestWithDetails } from '../../../api/mentorship';
import { 
  mockMentoredGroups,
  CURRENT_PROFESSOR_NAME
} from '../data/mockData';
import { colors } from '../../student/styles/styles';
import type { MentoredGroup } from '../data/mockData';

type TabType = 'requests' | 'mygroups';

export default function ProfessorDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('requests');
  const [mentorshipRequests, setMentorshipRequests] = useState<MentorshipRequestWithDetails[]>([]);
  const [mentoredGroups, setMentoredGroups] = useState<MentoredGroup[]>(mockMentoredGroups);
  const [isLoading, setIsLoading] = useState(true);
  const [professorId, setProfessorId] = useState<number | null>(null);

  const pendingRequestCount = mentorshipRequests.filter(req => req.status === 'pending').length;

  // Fetch mentorship requests
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        // In a real app, you'd get the professor ID from the user data
        // For now, we'll use a placeholder
        const profId = 1; // Replace with actual professor ID from user
        setProfessorId(profId);
        
        const requests = await mentorshipApi.getForProfessor(profId);
        setMentorshipRequests(requests);
      } catch (error) {
        console.error('Failed to fetch mentorship requests:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleAcceptRequest = async (requestId: number) => {
    if (!window.confirm('Are you sure you want to accept this mentorship request? This will use one of your available slots.')) {
      return;
    }

    try {
      await mentorshipApi.updateStatus(requestId, 'accepted');
      
      // Refresh requests
      if (professorId) {
        const requests = await mentorshipApi.getForProfessor(professorId);
        setMentorshipRequests(requests);
      }

      alert('Mentorship request accepted successfully!');
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Failed to accept mentorship request');
    }
  };

  const handleRejectRequest = async (requestId: number, reason: string) => {
    try {
      await mentorshipApi.updateStatus(requestId, 'rejected', reason);
      
      // Refresh requests
      if (professorId) {
        const requests = await mentorshipApi.getForProfessor(professorId);
        setMentorshipRequests(requests);
      }

      alert('Mentorship request rejected.');
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Failed to reject mentorship request');
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
        flexDirection: 'column',
        height: '100vh',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        backgroundColor: colors.neutral.gray100
      }}
    >
      <ProfessorDashboardHeader 
        professorName={user?.name || CURRENT_PROFESSOR_NAME}
        onLogout={logout}
        requests={[]} // Update this with actual notification data
        onViewRequest={() => {}}
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

            {mentorshipRequests.length === 0 ? (
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
                {mentorshipRequests.map((request) => (
                  <MentorshipRequestCard
                    key={request.id}
                    request={request}
                    onAccept={handleAcceptRequest}
                    onReject={handleRejectRequest}
                  />
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
                  <Award size={40} style={{ color: colors.neutral.gray400 }} />
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
    </div>
  );
}