import { UserPlus, Users, Award } from 'lucide-react';
import { colors, baseCard, primaryButton, badge, iconContainer } from '../styles/styles';

interface Group {
  id: number;
  name: string;
  leaderId: number;
  leaderName: string;
  description: string;
  neededSkills: string[];
  currentMembers: number;
  maxMembers: number;
  hasMentor: boolean;
  mentorName?: string;
}

interface GroupCardProps {
  group: Group;
  onJoinRequest: (id: number) => void;
  currentStudentId?: number;
  isAlreadyMember?: boolean;
  isLeader?: boolean;
}

export default function GroupCard({ group, onJoinRequest, currentStudentId, isAlreadyMember = false, isLeader = false }: GroupCardProps) {
  const isFull = group.currentMembers >= group.maxMembers;

  return (
    <div
      style={baseCard}
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
                ...iconContainer,
                background: colors.primary.gradient,
                color: 'white',
                boxShadow: `0 4px 12px ${colors.primary.shadow}`
              }}
            >
              <Users size={20} />
            </div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold', color: colors.neutral.gray900 }}>
              {group.name}
            </h3>
          </div>
          <div
            style={{
              ...badge,
              background: isFull ? colors.danger.light : colors.success.light,
              color: isFull ? colors.danger.text : colors.success.text,
              border: `2px solid ${isFull ? colors.danger.border : colors.success.border}`,
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

      {!isFull && !isLeader && !isAlreadyMember && (
        <button
          onClick={() => onJoinRequest(group.id)}
          style={{
            ...primaryButton,
            width: '100%'
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
          <UserPlus size={16} />
          Request to Join
        </button>
      )}

      {isLeader && (
        <div style={{
          padding: '0.75rem',
          background: colors.success.light,
          color: colors.success.text,
          borderRadius: '8px',
          textAlign: 'center',
          fontWeight: '600',
          fontSize: '0.875rem',
          border: `2px solid ${colors.success.border}`
        }}>
          You are the leader of this group
        </div>
      )}

      {!isLeader && isAlreadyMember && (
        <div style={{
          padding: '0.75rem',
          background: colors.primary.gradient,
          color: 'white',
          borderRadius: '8px',
          textAlign: 'center',
          fontWeight: '600',
          fontSize: '0.875rem',
          boxShadow: `0 2px 8px ${colors.primary.shadow}`
        }}>
          You are a member of this group
        </div>
      )}
    </div>
  );
}