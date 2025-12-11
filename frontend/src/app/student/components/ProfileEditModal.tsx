import { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2 } from 'lucide-react';
import { colors, baseCard, primaryButton, outlineButton, baseInput } from '../styles/styles';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: {
    bio: string;
    skills: string[];
    looking_for_group: boolean;
  };
  onSave: (updatedProfile: any) => Promise<void>;
}

export default function ProfileEditModal({ isOpen, onClose, currentProfile, onSave }: ProfileEditModalProps) {
  const [bio, setBio] = useState(currentProfile.bio);
  const [skills, setSkills] = useState<string[]>(currentProfile.skills);
  const [lookingForGroup, setLookingForGroup] = useState(currentProfile.looking_for_group);
  const [currentSkill, setCurrentSkill] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setBio(currentProfile.bio);
      setSkills(currentProfile.skills);
      setLookingForGroup(currentProfile.looking_for_group);
    }
  }, [isOpen, currentProfile]);

  if (!isOpen) return null;

  const handleAddSkill = () => {
    if (currentSkill.trim() && !skills.includes(currentSkill.trim())) {
      setSkills([...skills, currentSkill.trim()]);
      setCurrentSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave({
        bio,
        skills,
        looking_for_group: lookingForGroup
      });
      onClose();
    } catch (error) {
      alert('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
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
      
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: '600px',
          maxHeight: '90vh',
          overflow: 'auto',
          ...baseCard,
          zIndex: 1001,
          padding: 0
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.5rem',
            borderBottom: `2px solid ${colors.neutral.gray200}`,
            background: colors.success.gradient,
            color: 'white',
            borderRadius: '16px 16px 0 0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
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

        {/* Form */}
        <div style={{ padding: '1.5rem' }}>
          {/* Bio */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: colors.neutral.gray900,
              marginBottom: '0.5rem'
            }}>
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              rows={4}
              style={{
                ...baseInput,
                width: '100%',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#10b981';
                e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = colors.neutral.gray200;
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Skills */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: colors.neutral.gray900,
              marginBottom: '0.5rem'
            }}>
              Skills
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <input
                type="text"
                value={currentSkill}
                onChange={(e) => setCurrentSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                placeholder="Add a skill"
                style={{
                  ...baseInput,
                  flex: 1
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#10b981';
                  e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = colors.neutral.gray200;
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button
                onClick={handleAddSkill}
                style={{
                  ...outlineButton,
                  padding: '0.875rem 1rem'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#10b981';
                  e.currentTarget.style.background = colors.neutral.gray50;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = colors.neutral.gray200;
                  e.currentTarget.style.background = colors.neutral.white;
                }}
              >
                <Plus size={18} />
              </button>
            </div>
            {skills.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {skills.map((skill) => (
                  <span
                    key={skill}
                    style={{
                      padding: '0.5rem 0.75rem',
                      background: colors.warning.gradient,
                      color: colors.warning.text,
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      border: `2px solid ${colors.warning.border}`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    {skill}
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        display: 'flex',
                        color: colors.warning.text
                      }}
                    >
                      <Trash2 size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Looking for Group Toggle */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              cursor: 'pointer',
              padding: '1rem',
              background: colors.neutral.gray50,
              borderRadius: '12px',
              border: `2px solid ${colors.neutral.gray200}`
            }}>
              <input
                type="checkbox"
                checked={lookingForGroup}
                onChange={(e) => setLookingForGroup(e.target.checked)}
                style={{
                  width: '20px',
                  height: '20px',
                  cursor: 'pointer',
                  accentColor: '#10b981'
                }}
              />
              <div>
                <div style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: colors.neutral.gray900,
                  marginBottom: '0.25rem'
                }}>
                  Looking for a group
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: colors.neutral.gray600
                }}>
                  Show that you're available to join research groups
                </div>
              </div>
            </label>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={onClose}
              disabled={isSaving}
              style={{
                ...outlineButton,
                flex: 1,
                padding: '0.75rem',
                opacity: isSaving ? 0.6 : 1,
                cursor: isSaving ? 'not-allowed' : 'pointer'
              }}
              onMouseEnter={(e) => {
                if (!isSaving) {
                  e.currentTarget.style.background = colors.neutral.gray50;
                }
              }}
              onMouseLeave={(e) => {
                if (!isSaving) {
                  e.currentTarget.style.background = colors.neutral.white;
                }
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              style={{
                ...primaryButton,
                flex: 1,
                padding: '0.75rem',
                opacity: isSaving ? 0.6 : 1,
                cursor: isSaving ? 'not-allowed' : 'pointer'
              }}
              onMouseEnter={(e) => {
                if (!isSaving) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = `0 6px 20px ${colors.primary.shadowHover}`;
                }
              }}
              onMouseLeave={(e) => {
                if (!isSaving) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = `0 4px 12px ${colors.primary.shadow}`;
                }
              }}
            >
              <Save size={18} />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}