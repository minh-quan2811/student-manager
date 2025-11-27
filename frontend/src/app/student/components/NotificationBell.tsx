import { useState } from 'react';
import { Bell, Clock } from 'lucide-react';
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

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      onNotificationClick(notification.id);
    }
    if (notification.link) {
      // Handle navigation if needed
    }
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
                notifications.map((notification) => (
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
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}