// frontend/src/app/student/components/CreateGroupModal.tsx
import { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { colors, baseCard, primaryButton, outlineButton, baseInput } from '../styles/styles';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (groupData: {
    name: string;
    description: string;
    neededSkills: string[];
    maxMembers: number;
  }) => void;
}

export default function CreateGroupModal({ isOpen, onClose, onSubmit }: CreateGroupModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [maxMembers, setMaxMembers] = useState(5);
  const [neededSkills, setNeededSkills] = useState<string[]>([]);
  const [currentSkill, setCurrentSkill] = useState('');

  if (!isOpen) return null;

  const handleAddSkill = () => {
    if (currentSkill.trim() && !neededSkills.includes(currentSkill.trim())) {
      setNeededSkills([...neededSkills, currentSkill.trim()]);
      setCurrentSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setNeededSkills(neededSkills.filter(s => s !== skill));
  };

  const handleSubmit = () => {
    if (!name.trim() || !description.trim() || neededSkills.length === 0) {
      alert('Please fill in all required fields');
      return;
    }

    onSubmit({
      name: name.trim(),
      description: description.trim(),
      neededSkills,
      maxMembers
    });

    // Reset form
    setName('');
    setDescription('');
    setNeededSkills([]);
    setCurrentSkill('');
    setMaxMembers(5);
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
        <div
          style={{
            padding: '1.5rem',
            borderBottom: `2px solid ${colors.neutral.gray200}`,
            background: colors.primary.gradient,
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderRadius: '16px 16px 0 0'
          }}
        >
          <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>Create New Group</h2>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '8px',
              padding: '0.5rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
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
            <label
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: colors.neutral.gray900,
                marginBottom: '0.5rem'
              }}
            >
              Group Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter group name"
              style={{
                ...baseInput,
                width: '100%'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = colors.neutral.gray200;
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

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
              Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your research group"
              rows={4}
              style={{
                ...baseInput,
                width: '100%',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = colors.neutral.gray200;
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

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
              Max Members *
            </label>
            <input
              type="number"
              value={maxMembers}
              onChange={(e) => setMaxMembers(Math.max(2, parseInt(e.target.value) || 2))}
              min="2"
              max="10"
              style={{
                ...baseInput,
                width: '100%'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = colors.neutral.gray200;
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

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
              Needed Skills *
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
                  e.target.style.borderColor = '#667eea';
                  e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
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
                  e.currentTarget.style.borderColor = '#667eea';
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
            {neededSkills.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {neededSkills.map((skill) => (
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

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '2rem' }}>
            <button
              onClick={onClose}
              style={{
                ...outlineButton,
                flex: 1,
                padding: '0.75rem'
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
              onClick={handleSubmit}
              style={{
                ...primaryButton,
                flex: 1,
                padding: '0.75rem'
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
              Create Group
            </button>
          </div>
        </div>
      </div>
    </>
  );
}