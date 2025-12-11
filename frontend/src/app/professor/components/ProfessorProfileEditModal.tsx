import { useState } from 'react';
import { X, Save, Plus, Trash2 } from 'lucide-react';

interface ProfessorProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: {
    bio: string;
    research_interests: string[];
    total_slots: number;
  };
  onSave: (updatedProfile: any) => Promise<void>;
}

export default function ProfessorProfileEditModal({ 
  isOpen, 
  onClose, 
  currentProfile, 
  onSave 
}: ProfessorProfileEditModalProps) {
  const [bio, setBio] = useState(currentProfile.bio);
  const [researchInterests, setResearchInterests] = useState<string[]>(currentProfile.research_interests);
  const [totalSlots, setTotalSlots] = useState(currentProfile.total_slots);
  const [currentInterest, setCurrentInterest] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleAddInterest = () => {
    if (currentInterest.trim() && !researchInterests.includes(currentInterest.trim())) {
      setResearchInterests([...researchInterests, currentInterest.trim()]);
      setCurrentInterest('');
    }
  };

  const handleRemoveInterest = (interest: string) => {
    setResearchInterests(researchInterests.filter(i => i !== interest));
  };

  const handleSave = async () => {
    if (totalSlots < 1) {
      alert('Total slots must be at least 1');
      return;
    }

    setIsSaving(true);
    try {
      await onSave({
        bio,
        research_interests: researchInterests,
        total_slots: totalSlots
      });
      onClose();
    } catch (error) {
      alert('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '20px',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        {/* Header */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '2px solid #e5e7eb',
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderRadius: '20px 20px 0 0'
        }}>
          <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>
            Edit Your Profile
          </h2>
          <button
            onClick={onClose}
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

        {/* Form */}
        <div style={{ padding: '1.5rem' }}>
          {/* Bio */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about your research and experience..."
              rows={5}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '2px solid #e5e7eb',
                borderRadius: '10px',
                fontSize: '0.9375rem',
                outline: 'none',
                resize: 'vertical',
                fontFamily: 'inherit',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Research Interests */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Research Interests
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <input
                type="text"
                value={currentInterest}
                onChange={(e) => setCurrentInterest(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddInterest()}
                placeholder="Add a research interest"
                style={{
                  flex: 1,
                  padding: '0.75rem 1rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '10px',
                  fontSize: '0.9375rem',
                  outline: 'none'
                }}
              />
              <button
                onClick={handleAddInterest}
                style={{
                  padding: '0.75rem 1rem',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  boxShadow: '0 2px 8px rgba(245, 158, 11, 0.3)'
                }}
              >
                <Plus size={18} />
              </button>
            </div>
            {researchInterests.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {researchInterests.map((interest) => (
                  <span
                    key={interest}
                    style={{
                      padding: '0.5rem 0.75rem',
                      background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                      color: '#92400e',
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      border: '2px solid #fde68a',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    {interest}
                    <button
                      onClick={() => handleRemoveInterest(interest)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        display: 'flex',
                        color: '#92400e'
                      }}
                    >
                      <Trash2 size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Total Slots */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Total Mentorship Slots
            </label>
            <div style={{
              padding: '1rem',
              background: '#f9fafb',
              borderRadius: '12px',
              border: '2px solid #e5e7eb'
            }}>
              <input
                type="number"
                min="1"
                max="20"
                value={totalSlots}
                onChange={(e) => setTotalSlots(parseInt(e.target.value) || 1)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '10px',
                  fontSize: '0.9375rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  marginBottom: '0.5rem'
                }}
              />
              <p style={{
                margin: 0,
                fontSize: '0.75rem',
                color: '#6b7280',
                lineHeight: '1.4'
              }}>
                The maximum number of research groups you can mentor simultaneously.
                Current available slots will be adjusted if you decrease this number.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={onClose}
              disabled={isSaving}
              style={{
                flex: 1,
                padding: '0.875rem',
                background: 'white',
                color: '#6b7280',
                border: '2px solid #e5e7eb',
                borderRadius: '10px',
                fontWeight: '600',
                cursor: isSaving ? 'not-allowed' : 'pointer',
                opacity: isSaving ? 0.6 : 1
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              style={{
                flex: 1,
                padding: '0.875rem',
                background: isSaving
                  ? '#9ca3af'
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontWeight: '600',
                cursor: isSaving ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: isSaving ? 'none' : '0 4px 12px rgba(102, 126, 234, 0.4)'
              }}
            >
              <Save size={18} />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}