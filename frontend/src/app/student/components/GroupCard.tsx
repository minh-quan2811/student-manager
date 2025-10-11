// frontend/src/app/student/components/GroupCard.tsx
import { UserPlus, Users } from 'lucide-react';

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
}

export default function GroupCard({ group, onJoinRequest }: GroupCardProps) {
  const isFull = group.currentMembers >= group.maxMembers;

  return (
    <div
      style={{
        background: 'white',
        borderRadius: '16px',
        padding: '1.5rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease',
        border: '2px solid #e5e7eb'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
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
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                flexShrink: 0
              }}
            >
              <Users size={20} />
            </div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937' }}>
              {group.name}
            </h3>
          </div>
          <div
            style={{
              padding: '0.375rem 0.875rem',
              background: isFull ? '#fee2e2' : '#dcfce7',
              color: isFull ? '#991b1b' : '#166534',
              borderRadius: '8px',
              fontSize: '0.75rem',
              fontWeight: '600',
              border: `2px solid ${isFull ? '#fecaca' : '#bbf7d0'}`,
              whiteSpace: 'nowrap',
              marginLeft: '0.5rem'
            }}
          >
            {group.currentMembers}/{group.maxMembers}
          </div>
        </div>
        <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 0.5rem 0' }}>
          Led by <span style={{ fontWeight: '600', color: '#1f2937' }}>{group.leaderName}</span>
        </p>
        {group.hasMentor && (
          <p
            style={{
              fontSize: '0.875rem',
              color: '#10b981',
              margin: 0,
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}
          >
            <span style={{ fontSize: '1rem' }}>✓</span> Mentor: {group.mentorName}
          </p>
        )}
      </div>

      <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem', lineHeight: '1.5' }}>
        {group.description}
      </p>

      <div style={{ marginBottom: '1.5rem' }}>
        <p
          style={{
            fontSize: '0.75rem',
            fontWeight: '600',
            color: '#1f2937',
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
                background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                color: '#92400e',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: '600',
                border: '2px solid #fde68a'
              }}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {!isFull && (
        <button
          onClick={() => onJoinRequest(group.id)}
          style={{
            width: '100%',
            padding: '0.75rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
          }}
        >
          <UserPlus size={16} />
          Request to Join
        </button>
      )}
    </div>
  );
}