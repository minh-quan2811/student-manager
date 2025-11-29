import { useState } from 'react';
import { X, Send } from 'lucide-react';
import { colors, baseCard, primaryButton, outlineButton, baseInput } from '../styles/styles';
import type { Group } from '../../../api/types';

interface ProfessorInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  professorId: number;
  professorName: string;
  myGroups: Group[];
  onSubmit: (groupId: number, message: string) => Promise<void>;
}

export default function ProfessorInviteModal({
  isOpen,
  onClose,
  professorId,
  professorName,
  myGroups,
  onSubmit
}: ProfessorInviteModalProps) {
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Filter groups where user is the leader
  const leaderGroups = myGroups.filter(g => g.leader_id !== undefined);

  const handleSubmit = async () => {
    if (!selectedGroupId) {
      alert('Please select a group');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(selectedGroupId, message.trim() || 'I would like to invite you as a mentor for our research group.');
      setSelectedGroupId(null);
      setMessage('');
      onClose();
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Failed to send mentorship request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
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

      {/* Modal */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          ...baseCard,
          maxWidth: '600px',
          width: '90%',
          maxHeight: '80vh',
          overflow: 'auto',
          zIndex: 1001,
          padding: 0
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.5rem',
            borderBottom: `2px solid ${colors.neutral.gray200}`,
            background: colors.secondary.gradient,
            color: 'white',
            borderRadius: '16px 16px 0 0'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>
                Request Mentorship
              </h2>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', opacity: 0.9 }}>
                Invite {professorName} to mentor your group
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                borderRadius: '8px',
                padding: '0.5rem',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                display: 'flex',
                color: 'white',
                opacity: isSubmitting ? 0.5 : 1
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div style={{ padding: '1.5rem' }}>
          {leaderGroups.length === 0 ? (
            <div style={{
              padding: '2rem',
              textAlign: 'center',
              color: colors.neutral.gray600
            }}>
              <p style={{ margin: 0, fontSize: '0.875rem' }}>
                You need to be a group leader to send mentorship requests.
              </p>
            </div>
          ) : (
            <>
              {/* Select Group */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: colors.neutral.gray900,
                    marginBottom: '0.5rem'
                  }}
                >
                  Select Your Group *
                </label>
                <select
                  value={selectedGroupId || ''}
                  onChange={(e) => setSelectedGroupId(Number(e.target.value))}
                  disabled={isSubmitting}
                  style={{
                    ...baseInput,
                    width: '100%',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer'
                  }}
                >
                  <option value="">Choose a group...</option>
                  {leaderGroups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name} ({group.current_members}/{group.max_members} members)
                    </option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: colors.neutral.gray900,
                    marginBottom: '0.5rem'
                  }}
                >
                  Message (Optional)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="Explain why you'd like this professor to mentor your group..."
                  rows={6}
                  style={{
                    ...baseInput,
                    width: '100%',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#f59e0b';
                    e.target.style.boxShadow = '0 0 0 3px rgba(245, 158, 11, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = colors.neutral.gray200;
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <p style={{
                  margin: '0.5rem 0 0 0',
                  fontSize: '0.75rem',
                  color: colors.neutral.gray600
                }}>
                  Note: You can have up to 2 active (pending) mentorship requests at a time.
                  Each group can have a maximum of 2 mentors.
                </p>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={onClose}
                  disabled={isSubmitting}
                  style={{
                    ...outlineButton,
                    flex: 1,
                    padding: '0.75rem',
                    opacity: isSubmitting ? 0.5 : 1,
                    cursor: isSubmitting ? 'not-allowed' : 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !selectedGroupId}
                  style={{
                    ...primaryButton,
                    flex: 1,
                    padding: '0.75rem',
                    opacity: (isSubmitting || !selectedGroupId) ? 0.5 : 1,
                    cursor: (isSubmitting || !selectedGroupId) ? 'not-allowed' : 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSubmitting && selectedGroupId) {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = `0 6px 20px ${colors.primary.shadowHover}`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = `0 4px 12px ${colors.primary.shadow}`;
                  }}
                >
                  <Send size={16} />
                  {isSubmitting ? 'Sending...' : 'Send Request'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}