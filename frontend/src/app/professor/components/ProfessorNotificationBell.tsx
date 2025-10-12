// frontend/src/app/professor/components/ProfessorNotificationBell.tsx
import { useState } from 'react';
import { Bell, X, Clock, Users } from 'lucide-react';
import { colors, baseCard } from '../../student/styles/styles';
import type { MentorshipRequest } from '../data/mockData';

interface ProfessorNotificationBellProps {
  requests: MentorshipRequest[];
  onViewRequest: (requestId: number) => void;
}

export default function ProfessorNotificationBell({ requests, onViewRequest }: ProfessorNotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pendingCount = requests.filter(req => req.status === 'pending').length;

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'relative',
          padding: '0.625rem',
          background: 'rgba(255,255,255,0.2)',
          border: 'none',
          borderRadius: '10px',
          color: 'white',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
        }}
      >
        <Bell size={20} />
        {pendingCount > 0 && (
          <div
            style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              width: '20px',
              height: '20px',
              background: colors.danger.gradient,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.625rem',
              fontWeight: 'bold',
              border: '2px solid white',
              boxShadow: '0 2px 8px rgba(239, 68, 68, 0.4)'
            }}
          >
            {pendingCount}
          </div>
        )}
      </button>

      {isOpen && (
        <>
          <div
            onClick={() => setIsOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'transparent',
              zIndex: 999
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 'calc(100% + 12px)',
              right: 0,
              width: '380px',
              maxHeight: '500px',
              ...baseCard,
              zIndex: 1000,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div style={{
              padding: '1rem 1.25rem',
              borderBottom: `2px solid ${colors.neutral.gray200}`,
              background: colors.neutral.gray50
            }}>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 'bold', color: colors.neutral.gray900 }}>
                Mentorship Requests
              </h3>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', color: colors.neutral.gray600 }}>
                {pendingCount} pending request{pendingCount !== 1 ? 's' : ''}
              </p>
            </div>

            <div style={{ flex: 1, overflow: 'auto', maxHeight: '400px' }}>
              {requests.length === 0 ? (
                <div style={{
                  padding: '3rem 1.5rem',
                  textAlign: 'center',
                  color: colors.neutral.gray600
                }}>
                  <Bell size={48} style={{ opacity: 0.3, margin: '0 auto 1rem' }} />
                  <p style={{ margin: 0, fontSize: '0.875rem' }}>No mentorship requests</p>
                </div>
              ) : (
                requests.map((request) => (
                  <div
                    key={request.id}
                    onClick={() => {
                      onViewRequest(request.id);
                      setIsOpen(false);
                    }}
                    style={{
                      padding: '1rem 1.25rem',
                      borderBottom: `1px solid ${colors.neutral.gray200}`,
                      background: request.status === 'pending' ? colors.neutral.white : colors.neutral.gray50,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = colors.neutral.gray100;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = request.status === 'pending' ? colors.neutral.white : colors.neutral.gray50;
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 'bold', color: colors.neutral.gray900 }}>
                          {request.groupName}
                        </h4>
                        <p style={{ margin: '0.125rem 0 0 0', fontSize: '0.75rem', color: colors.neutral.gray600 }}>
                          by {request.leaderName}
                        </p>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          fontSize: '0.625rem',
                          color: colors.neutral.gray600
                        }}>
                          <Clock size={12} />
                          {formatTime(request.timestamp)}
                        </div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          fontSize: '0.625rem',
                          color: colors.neutral.gray600
                        }}>
                          <Users size={12} />
                          {request.members}/{request.maxMembers}
                        </div>
                      </div>
                    </div>

                    {request.status !== 'pending' && (
                      <div style={{
                        marginTop: '0.5rem',
                        padding: '0.25rem 0.5rem',
                        background: request.status === 'accepted' ? colors.success.light : colors.danger.light,
                        color: request.status === 'accepted' ? colors.success.text : colors.danger.text,
                        borderRadius: '4px',
                        fontSize: '0.625rem',
                        fontWeight: '600',
                        textAlign: 'center',
                        border: `1px solid ${request.status === 'accepted' ? colors.success.border : colors.danger.border}`
                      }}>
                        {request.status === 'accepted' ? 'Accepted' : 'Rejected'}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}