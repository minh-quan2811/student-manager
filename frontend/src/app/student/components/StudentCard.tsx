import { UserPlus } from 'lucide-react';
import { colors, baseCard, successButton, badge } from '../styles/styles';

interface Student {
  id: number;
  name: string;
  email: string;
  gpa: number;
  major: string;
  skills: string[];
  bio: string;
  lookingForGroup: boolean;
  year: string;
}

interface StudentCardProps {
  student: Student;
  onInvite: (id: number) => void;
  onViewProfile?: (id: number) => void;
}

export default function StudentCard({ student, onInvite, onViewProfile }: StudentCardProps) {
  return (
    <div
      style={baseCard}
      onClick={() => onViewProfile?.(student.id)}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.15)';
        e.currentTarget.style.cursor = 'pointer';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = baseCard.boxShadow;
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              background: colors.success.gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1.25rem',
              boxShadow: `0 4px 12px ${colors.success.shadow}`
            }}
          >
            {student.name[0]}
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 'bold', color: colors.neutral.gray900 }}>
              {student.name}
            </h3>
            <p style={{ margin: 0, fontSize: '0.875rem', color: colors.neutral.gray600 }}>{student.year}</p>
          </div>
        </div>
        {student.lookingForGroup && (
          <span
            style={{
              ...badge,
              background: colors.success.gradient,
              color: 'white',
              boxShadow: `0 2px 8px ${colors.success.shadow}`
            }}
          >
            Looking
          </span>
        )}
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <p style={{ fontSize: '0.875rem', color: colors.neutral.gray600, margin: '0 0 0.5rem 0', lineHeight: '1.5' }}>
          {student.bio}
        </p>
        <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.75rem', color: colors.neutral.gray600 }}>
          <span>
            <strong style={{ color: colors.neutral.gray900 }}>Major:</strong> {student.major}
          </span>
          <span>•</span>
          <span>
            <strong style={{ color: colors.neutral.gray900 }}>GPA:</strong> {student.gpa}
          </span>
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: '600', color: colors.neutral.gray900, marginBottom: '0.5rem', letterSpacing: '0.5px' }}>
          SKILLS
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {student.skills.map((skill) => (
            <span
              key={skill}
              style={{
                ...badge,
                background: colors.neutral.gray100,
                border: `2px solid ${colors.neutral.gray200}`,
                color: colors.neutral.gray900
              }}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onInvite(student.id);
        }}
        style={{
          ...successButton,
          width: '100%'
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
        <UserPlus size={16} />
        Invite to Group
      </button>
    </div>
  );
}