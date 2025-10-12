// frontend/src/app/student/components/MyGroupCard.tsx
import { Users, Crown, Edit, Trash2, UserMinus, Award } from 'lucide-react';
import { colors, baseCard, primaryButton, dangerButton, outlineButton } from '../styles/styles';
import type { Group } from '../data/mockData';
import { CURRENT_USER_ID } from '../data/mockData';

interface MyGroupCardProps {
  group: Group;
  onEdit?: (groupId: number) => void;
  onDelete?: (groupId: number) => void;
  onLeave?: (groupId: number) => void;
}

export default function MyGroupCard({ group, onEdit, onDelete, onLeave }: MyGroupCardProps) {
  const isLeader = group.leaderId === CURRENT_USER_ID;
  const userRole = group.members?.find(m => m.id === CURRENT_USER_ID)?.role;

  return (
    <div
      style={{
        ...baseCard,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.15)';
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
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: isLeader ? colors.primary.gradient : colors.success.gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                boxShadow: `0 4px 12px ${isLeader ? colors.primary.shadow : colors.success.shadow}`,
                flexShrink: 0
              }}
            >
              {isLeader ? <Crown size={20} /> : <Users size={20} />}
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold', color: colors.neutral.gray900 }}>
                {group.name}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                <span style={{
                  padding: '0.25rem 0.625rem',
                  background: isLeader ? colors.primary.gradient : colors.success.gradient,
                  color: 'white',
                  borderRadius: '6px',
                  fontSize: '0.625rem',
                  fontWeight: '600',
                  boxShadow: `0 2px 6px ${isLeader ? colors.primary.shadow : colors.success.shadow}`
                }}>
                  {isLeader ? 'Leader' : 'Member'}
                </span>
              </div>
            </div>
          </div>
          <div
            style={{
              padding: '0.375rem 0.875rem',
              background: group.currentMembers >= group.maxMembers ? colors.danger.light : colors.success.light,
              color: group.currentMembers >= group.maxMembers ? colors.danger.text : colors.success.text,
              borderRadius: '8px',
              fontSize: '0.75rem',
              fontWeight: '600',
              border: `2px solid ${group.currentMembers >= group.maxMembers ? colors.danger.border : colors.success.border}`,
              whiteSpace: 'nowrap',
              marginLeft: '0.5rem'
            }}
          >
            {group.currentMembers}/{group.maxMembers}
          </div>
        </div>
        <p style={{ fontSize: '0.875rem', color: colors.neutral.gray600, margin: '0 0 0.5rem 0' }}>
          Led by <span style={{ fontWeight: '600', color: colors.neutral.gray900 }}>{group.leaderName}</span>
        </p>
        {group.hasMentor && (
          <p
            style={{
              fontSize: '0.875rem',
              color: colors.success.text,
              margin: 0,
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}
          >
            <Award size={14} />
            Mentor: {group.mentorName}
          </p>
        )}
      </div>

      <p style={{ fontSize: '0.875rem', color: colors.neutral.gray600, marginBottom: '1rem', lineHeight: '1.5' }}>
        {group.description}
      </p>

      <div style={{ marginBottom: '1.5rem' }}>
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
          {group.neededSkills.map((skill) => (
            <span
              key={skill}
              style={{
                padding: '0.375rem 0.875rem',
                background: colors.warning.gradient,
                color: colors.warning.text,
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: '600',
                border: `2px solid ${colors.warning.border}`
              }}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Members List */}
      {group.members && group.members.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <p
            style={{
              fontSize: '0.75rem',
              fontWeight: '600',
              color: colors.neutral.gray900,
              marginBottom: '0.5rem',
              letterSpacing: '0.5px'
            }}
          >
            MEMBERS ({group.members.length})
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {group.members.map((member) => (
              <div
                key={member.id}
                style={{
                  padding: '0.5rem 0.75rem',
                  background: colors.neutral.gray50,
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  border: `2px solid ${colors.neutral.gray200}`
                }}
              >
                <span style={{ fontSize: '0.75rem', color: colors.neutral.gray900, fontWeight: '500' }}>
                  {member.name}
                </span>
                {member.role === 'leader' && (
                  <Crown size={14} style={{ color: colors.warning.text }} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {isLeader ? (
          <>
            <button
              onClick={() => onEdit?.(group.id)}
              style={{
                ...outlineButton,
                flex: 1,
                padding: '0.75rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.borderColor = colors.primary.gradient.split(' ')[1];
                e.currentTarget.style.background = colors.neutral.gray50;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = colors.neutral.gray200;
                e.currentTarget.style.background = colors.neutral.white;
              }}
            >
              <Edit size={16} />
              Edit Group
            </button>
            <button
              onClick={() => onDelete?.(group.id)}
              style={{
                ...dangerButton,
                flex: 1,
                padding: '0.75rem'
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
              <Trash2 size={16} />
              Delete
            </button>
          </>
        ) : (
          <button
            onClick={() => onLeave?.(group.id)}
            style={{
              ...dangerButton,
              width: '100%',
              padding: '0.75rem'
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
            <UserMinus size={16} />
            Leave Group
          </button>
        )}
      </div>
    </div>
  );
}