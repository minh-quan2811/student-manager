// frontend/src/app/professor/components/MentoredGroupCard.tsx
import { Users, Crown, Calendar, CheckCircle, Clock } from 'lucide-react';
import { colors, baseCard, badge, iconContainer } from '../../student/styles/styles';
import type { MentoredGroup } from '../data/mockData';

interface MentoredGroupCardProps {
  group: MentoredGroup;
}

export default function MentoredGroupCard({ group }: MentoredGroupCardProps) {
  const isActive = group.status === 'active';

  return (
    <div
      style={{
        ...baseCard,
        opacity: isActive ? 1 : 0.8
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
                ...iconContainer,
                background: isActive ? colors.secondary.gradient : colors.neutral.gray400,
                color: 'white',
                boxShadow: `0 4px 12px ${isActive ? colors.secondary.shadow : 'rgba(0,0,0,0.2)'}`
              }}
            >
              <Users size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold', color: colors.neutral.gray900 }}>
                {group.name}
              </h3>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: colors.neutral.gray600 }}>
                Led by <span style={{ fontWeight: '600' }}>{group.leaderName}</span>
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
            <div
              style={{
                ...badge,
                background: group.currentMembers >= group.maxMembers 
                  ? colors.danger.light 
                  : colors.success.light,
                color: group.currentMembers >= group.maxMembers 
                  ? colors.danger.text 
                  : colors.success.text,
                border: `2px solid ${group.currentMembers >= group.maxMembers ? colors.danger.border : colors.success.border}`
              }}
            >
              {group.currentMembers}/{group.maxMembers}
            </div>
            <div
              style={{
                ...badge,
                background: isActive ? colors.success.light : colors.neutral.gray100,
                color: isActive ? colors.success.text : colors.neutral.gray600,
                border: `2px solid ${isActive ? colors.success.border : colors.neutral.gray200}`,
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
            >
              {isActive ? <Clock size={12} /> : <CheckCircle size={12} />}
              {isActive ? 'Active' : 'Completed'}
            </div>
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 0.75rem',
          background: colors.neutral.gray50,
          borderRadius: '8px',
          border: `2px solid ${colors.neutral.gray200}`,
          fontSize: '0.75rem',
          color: colors.neutral.gray600,
          marginTop: '0.75rem'
        }}>
          <Calendar size={14} />
          Started: {new Date(group.startDate).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          })}
        </div>
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
          SKILLS & FOCUS AREAS
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

      <div>
        <p
          style={{
            fontSize: '0.75rem',
            fontWeight: '600',
            color: colors.neutral.gray900,
            marginBottom: '0.5rem',
            letterSpacing: '0.5px'
          }}
        >
          TEAM MEMBERS ({group.members.length})
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {group.members.map((member) => (
            <div
              key={member.id}
              style={{
                padding: '0.625rem 0.875rem',
                background: colors.neutral.gray50,
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                border: `2px solid ${colors.neutral.gray200}`
              }}
            >
              <span style={{ fontSize: '0.8rem', color: colors.neutral.gray900, fontWeight: '500' }}>
                {member.name}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {member.role === 'leader' && (
                  <Crown size={14} style={{ color: colors.warning.text }} />
                )}
                <span style={{ fontSize: '0.7rem', color: colors.neutral.gray600 }}>
                  Joined {new Date(member.joinedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}