// frontend/src/app/professor/components/MentorshipRequestCard.tsx
import { useState } from 'react';
import { Users, Check, X, Clock, User, MessageSquare } from 'lucide-react';
import { colors, baseCard, successButton, dangerButton, badge, iconContainer } from '../../student/styles/styles';
import type { MentorshipRequest } from '../data/mockData';

interface MentorshipRequestCardProps {
  request: MentorshipRequest;
  onAccept: (requestId: number) => void;
  onReject: (requestId: number, note: string) => void;
}

export default function MentorshipRequestCard({ request, onAccept, onReject }: MentorshipRequestCardProps) {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionNote, setRejectionNote] = useState('');
  const [showDetails, setShowDetails] = useState(false);

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

  const handleReject = () => {
    if (!rejectionNote.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    onReject(request.id, rejectionNote);
    setShowRejectModal(false);
    setRejectionNote('');
  };

  return (
    <>
      <div
        style={{
          ...baseCard,
          opacity: request.status !== 'pending' ? 0.7 : 1
        }}
        onMouseEnter={(e) => {
          if (request.status === 'pending') {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.15)';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = baseCard.boxShadow;
        }}
      >
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
              <div
                style={{
                  ...iconContainer,
                  background: request.status === 'accepted' 
                    ? colors.success.gradient 
                    : request.status === 'rejected' 
                    ? colors.danger.gradient 
                    : colors.primary.gradient,
                  color: 'white',
                  boxShadow: `0 4px 12px ${
                    request.status === 'accepted' 
                      ? colors.success.shadow 
                      : request.status === 'rejected' 
                      ? colors.danger.shadow 
                      : colors.primary.shadow
                  }`
                }}
              >
                <Users size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold', color: colors.neutral.gray900 }}>
                  {request.groupName}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: colors.neutral.gray600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <User size={14} />
                    Led by {request.leaderName}
                  </p>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
              <div
                style={{
                  ...badge,
                  background: request.members >= request.maxMembers 
                    ? colors.danger.light 
                    : colors.success.light,
                  color: request.members >= request.maxMembers 
                    ? colors.danger.text 
                    : colors.success.text,
                  border: `2px solid ${request.members >= request.maxMembers ? colors.danger.border : colors.success.border}`,
                  whiteSpace: 'nowrap'
                }}
              >
                {request.members}/{request.maxMembers}
              </div>
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
            </div>
          </div>

          {request.status !== 'pending' && (
            <div style={{
              marginTop: '0.5rem',
              padding: '0.5rem 0.75rem',
              background: request.status === 'accepted' ? colors.success.light : colors.danger.light,
              color: request.status === 'accepted' ? colors.success.text : colors.danger.text,
              borderRadius: '8px',
              fontSize: '0.75rem',
              fontWeight: '600',
              border: `2px solid ${request.status === 'accepted' ? colors.success.border : colors.danger.border}`
            }}>
              {request.status === 'accepted' ? '✓ Accepted' : '✗ Rejected'}
            </div>
          )}
        </div>

        <p style={{ fontSize: '0.875rem', color: colors.neutral.gray600, marginBottom: '1rem', lineHeight: '1.5' }}>
          {request.description}
        </p>

        <div style={{ marginBottom: '1rem' }}>
          <p
            style={{
              fontSize: '0.75rem',
              fontWeight: '600',
              color: colors.neutral.gray900,
              marginBottom: '0.5rem',
              letterSpacing: '0.5px'
            }}
          >
            NEEDED SKILLS
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {request.neededSkills.map((skill) => (
              <span
                key={skill}
                style={{
                  ...badge,
                  background: colors.warning.gradient,
                  color: colors.warning.text,
                  border: `2px solid ${colors.warning.border}`
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div
          style={{
            padding: '1rem',
            background: colors.neutral.gray50,
            borderRadius: '12px',
            marginBottom: '1rem',
            border: `2px solid ${colors.neutral.gray200}`
          }}
        >
          <p style={{
            fontSize: '0.75rem',
            fontWeight: '600',
            color: colors.neutral.gray900,
            marginBottom: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}>
            <MessageSquare size={14} />
            REQUEST MESSAGE
          </p>
          <p style={{
            fontSize: '0.875rem',
            color: colors.neutral.gray600,
            margin: 0,
            lineHeight: '1.6'
          }}>
            "{request.requestMessage}"
          </p>
        </div>

        {request.status === 'rejected' && request.rejectionNote && (
          <div
            style={{
              padding: '1rem',
              background: colors.danger.light,
              borderRadius: '12px',
              marginBottom: '1rem',
              border: `2px solid ${colors.danger.border}`
            }}
          >
            <p style={{
              fontSize: '0.75rem',
              fontWeight: '600',
              color: colors.danger.text,
              marginBottom: '0.5rem'
            }}>
              REJECTION NOTE
            </p>
            <p style={{
              fontSize: '0.875rem',
              color: colors.danger.text,
              margin: 0,
              lineHeight: '1.6'
            }}>
              {request.rejectionNote}
            </p>
          </div>
        )}

        {request.status === 'pending' && (
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={() => onAccept(request.id)}
              style={{
                ...successButton,
                flex: 1
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = `0 6px 20px ${colors.success.shadowHover}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = `0 4px 12px ${colors.success.shadow}`;
              }}
            >
              <Check size={16} />
              Accept
            </button>
            <button
              onClick={() => setShowRejectModal(true)}
              style={{
                ...dangerButton,
                flex: 1
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = `0 6px 20px ${colors.danger.shadowHover}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = `0 4px 12px ${colors.danger.shadow}`;
              }}
            >
              <X size={16} />
              Reject
            </button>
          </div>
        )}
      </div>

      {/* Rejection Modal */}
      {showRejectModal && (
        <>
          <div
            onClick={() => setShowRejectModal(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1000,
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
              ...baseCard,
              zIndex: 1001,
              padding: 0
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
                alignItems: 'center',
                borderRadius: '16px 16px 0 0'
              }}
            >
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold' }}>
                Reject Mentorship Request
              </h2>
              <button
                onClick={() => setShowRejectModal(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.5rem',
                  cursor: 'pointer',
                  display: 'flex',
                  color: 'white'
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '1.5rem' }}>
              <p style={{ fontSize: '0.875rem', color: colors.neutral.gray600, marginBottom: '1rem' }}>
                Please provide a reason for rejecting <strong>{request.groupName}</strong>. This will help the group understand your decision.
              </p>

              <textarea
                value={rejectionNote}
                onChange={(e) => setRejectionNote(e.target.value)}
                placeholder="Enter your reason for rejection..."
                rows={5}
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem',
                  border: `2px solid ${colors.neutral.gray200}`,
                  borderRadius: '12px',
                  fontSize: '0.875rem',
                  outline: 'none',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  marginBottom: '1.5rem'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = colors.danger.text;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = colors.neutral.gray200;
                }}
              />

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={() => setShowRejectModal(false)}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    background: colors.neutral.white,
                    color: colors.neutral.gray600,
                    border: `2px solid ${colors.neutral.gray200}`,
                    borderRadius: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = colors.neutral.gray50;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = colors.neutral.white;
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  style={{
                    ...dangerButton,
                    flex: 1
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = `0 6px 20px ${colors.danger.shadowHover}`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = `0 4px 12px ${colors.danger.shadow}`;
                  }}
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}