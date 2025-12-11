import { useState } from 'react';
import { Bell, Clock, X, AlertCircle } from 'lucide-react';
import { colors, baseCard } from '../styles/styles';
import type { Notification } from '../../../api/notifications';

interface NotificationBellProps {
  notifications: Notification[];
  unreadCount: number;
  onNotificationClick: (notificationId: number) => void;
  onActionClick?: (notificationId: number, action: 'accept' | 'reject') => Promise<void>;
}

export default function NotificationBell({ 
  notifications, 
  unreadCount, 
  onNotificationClick,
  onActionClick
}: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loadingActionId, setLoadingActionId] = useState<number | null>(null);
  const [rejectionModalData, setRejectionModalData] = useState<{
    notification: Notification;
    reason: string;
  } | null>(null);

  const handleAction = async (notificationId: number, action: 'accept' | 'reject') => {
    if (!onActionClick) return;
    
    setLoadingActionId(notificationId);
    try {
      await onActionClick(notificationId, action);
    } finally {
      setLoadingActionId(null);
    }
  };

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

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read) {
      onNotificationClick(notification.id);
    }

    // If it's a mentorship rejection, fetch the rejection reason
    if (notification.type === 'mentorship_rejected' && notification.related_request_id) {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`http://localhost:8000/api/v1/mentorship-requests/${notification.related_request_id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const requestData = await response.json();
          if (requestData.rejection_reason) {
            setRejectionModalData({
              notification,
              reason: requestData.rejection_reason
            });
            return;
          }
        }
      } catch (error) {
        console.error('Failed to fetch rejection reason:', error);
      }
    }

    if (notification.link) {
      // Handle navigation if needed
    }
  };

  return (
    <>
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
          {unreadCount > 0 && (
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
              {unreadCount}
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
                  Notifications
                </h3>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', color: colors.neutral.gray600 }}>
                  {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                </p>
              </div>

              <div style={{ flex: 1, overflow: 'auto', maxHeight: '400px' }}>
                {notifications.length === 0 ? (
                  <div style={{
                    padding: '3rem 1.5rem',
                    textAlign: 'center',
                    color: colors.neutral.gray600
                  }}>
                    <Bell size={48} style={{ opacity: 0.3, margin: '0 auto 1rem' }} />
                    <p style={{ margin: 0, fontSize: '0.875rem' }}>No notifications yet</p>
                  </div>
                ) : (
                  notifications.map((notification) => {
                    const isMentorshipNotification = [
                      'mentorship_request',
                      'mentorship_accepted',
                      'mentorship_rejected'
                    ].includes(notification.type);

                    return (
                      <div
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification)}
                        style={{
                          padding: '1rem 1.25rem',
                          borderBottom: `1px solid ${colors.neutral.gray200}`,
                          background: notification.read ? colors.neutral.gray50 : colors.neutral.white,
                          cursor: 'pointer',
                          transition: 'background 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = colors.neutral.gray100;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = notification.read 
                            ? colors.neutral.gray50 
                            : colors.neutral.white;
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                          <div style={{ flex: 1 }}>
                            <h4 style={{ 
                              margin: 0, 
                              fontSize: '0.875rem', 
                              fontWeight: notification.read ? '500' : 'bold', 
                              color: colors.neutral.gray900 
                            }}>
                              {notification.title}
                            </h4>
                          </div>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            fontSize: '0.625rem',
                            color: colors.neutral.gray600
                          }}>
                            <Clock size={12} />
                            {formatTime(notification.created_at)}
                          </div>
                        </div>

                        <p style={{
                          margin: 0,
                          fontSize: '0.75rem',
                          color: colors.neutral.gray600,
                          lineHeight: '1.4'
                        }}>
                          {notification.message}
                        </p>

                        {isMentorshipNotification && (
                          <div style={{
                            display: 'inline-block',
                            padding: '0.25rem 0.5rem',
                            background: colors.warning.gradient,
                            color: colors.warning.text,
                            borderRadius: '4px',
                            fontSize: '0.625rem',
                            fontWeight: '600',
                            marginTop: '0.5rem'
                          }}>
                            Mentorship
                          </div>
                        )}

                        {notification.type === 'mentorship_rejected' && notification.related_request_id && (
                          <p style={{
                            margin: '0.5rem 0 0 0',
                            fontSize: '0.75rem',
                            color: colors.danger.text,
                            fontStyle: 'italic',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                          }}>
                            <AlertCircle size={12} />
                            Click to view rejection reason
                          </p>
                        )}

                        {(notification.type === 'group_invitation' || notification.type === 'join_request') && (
                          <div style={{
                            marginTop: '0.75rem',
                            display: 'flex',
                            gap: '0.5rem'
                          }}>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAction(notification.id, 'accept');
                              }}
                              disabled={loadingActionId === notification.id}
                              style={{
                                flex: 1,
                                padding: '0.5rem 0.75rem',
                                background: colors.primary.gradient,
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                cursor: loadingActionId === notification.id ? 'not-allowed' : 'pointer',
                                opacity: loadingActionId === notification.id ? 0.6 : 1,
                                transition: 'all 0.2s ease'
                              }}
                            >
                              {loadingActionId === notification.id ? '...' : 'Accept'}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAction(notification.id, 'reject');
                              }}
                              disabled={loadingActionId === notification.id}
                              style={{
                                flex: 1,
                                padding: '0.5rem 0.75rem',
                                background: colors.neutral.gray200,
                                color: colors.neutral.gray600,
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                cursor: loadingActionId === notification.id ? 'not-allowed' : 'pointer',
                                opacity: loadingActionId === notification.id ? 0.6 : 1,
                                transition: 'all 0.2s ease'
                              }}
                            >
                              {loadingActionId === notification.id ? '...' : 'Reject'}
                            </button>
                          </div>
                        )}

                        {!notification.read && (
                          <div style={{
                            marginTop: '0.5rem',
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: colors.primary.gradient
                          }} />
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Rejection Reason Modal */}
      {rejectionModalData && (
        <>
          <div
            onClick={() => setRejectionModalData(null)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              zIndex: 2000,
              backdropFilter: 'blur(4px)'
            }}
          />
          
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '90%',
              maxWidth: '500px',
              background: colors.neutral.white,
              borderRadius: '16px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              zIndex: 2001,
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                padding: '1.5rem',
                borderBottom: `2px solid ${colors.neutral.gray200}`,
                background: colors.danger.gradient,
                color: 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <AlertCircle size={24} />
                <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold' }}>
                  Request Rejected
                </h2>
              </div>
              <button
                onClick={() => setRejectionModalData(null)}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.5rem',
                  cursor: 'pointer',
                  display: 'flex',
                  color: 'white',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '1.5rem' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ 
                  margin: '0 0 0.5rem 0', 
                  fontSize: '1rem', 
                  fontWeight: '600', 
                  color: colors.neutral.gray900 
                }}>
                  {rejectionModalData.notification.title}
                </h3>
                <p style={{ 
                  margin: 0, 
                  fontSize: '0.875rem', 
                  color: colors.neutral.gray600,
                  lineHeight: '1.5'
                }}>
                  {rejectionModalData.notification.message}
                </p>
              </div>

              <div
                style={{
                  padding: '1rem',
                  background: colors.danger.light,
                  borderRadius: '12px',
                  border: `2px solid ${colors.danger.border}`,
                  marginBottom: '1.5rem'
                }}
              >
                <p style={{
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: colors.danger.text,
                  marginBottom: '0.5rem',
                  letterSpacing: '0.5px'
                }}>
                  REJECTION REASON
                </p>
                <p style={{
                  fontSize: '0.875rem',
                  color: colors.danger.text,
                  margin: 0,
                  lineHeight: '1.6'
                }}>
                  {rejectionModalData.reason}
                </p>
              </div>

              <button
                onClick={() => setRejectionModalData(null)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: colors.neutral.gray200,
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: colors.neutral.gray900,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = colors.neutral.gray50;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = colors.neutral.gray200;
                }}
              >
                Close
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}