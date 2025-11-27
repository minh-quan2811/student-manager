// frontend/src/app/student/components/ProfessorCard.tsx
import { MessageSquare, Award } from 'lucide-react';
import { colors, baseCard, secondaryButton, badge } from '../styles/styles';

interface Professor {
  id: number;
  name: string;
  email: string;
  department: string;
  researchAreas: string[];
  availableSlots: number;
  totalSlots: number;
}

interface ProfessorCardProps {
  professor: Professor;
  onRequestMentorship: (id: number) => void;
  onViewProfile?: (id: number) => void;
}

export default function ProfessorCard({ professor, onRequestMentorship, onViewProfile }: ProfessorCardProps) {
  const hasSlots = professor.availableSlots > 0;

  return (
    <div
      style={baseCard}
      onClick={() => onViewProfile?.(professor.id)}
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
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <div
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '12px',
            background: colors.secondary.gradient,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '1.5rem',
            boxShadow: `0 4px 12px ${colors.secondary.shadow}`
          }}
        >
          {professor.name.split(' ')[1][0]}
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold', color: colors.neutral.gray900 }}>
            {professor.name}
          </h3>
          <p style={{ margin: 0, fontSize: '0.875rem', color: colors.neutral.gray600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Award size={14} />
            {professor.department}
          </p>
        </div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: '600', color: colors.neutral.gray900, marginBottom: '0.5rem', letterSpacing: '0.5px' }}>
          RESEARCH AREAS
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {professor.researchAreas.map((area) => (
            <span
              key={area}
              style={{
                ...badge,
                background: colors.warning.gradient,
                color: colors.warning.text,
                border: `2px solid ${colors.warning.border}`
              }}
            >
              {area}
            </span>
          ))}
        </div>
      </div>

      <div
        style={{
          padding: '1rem',
          background: hasSlots ? colors.success.light : colors.danger.light,
          borderRadius: '12px',
          marginBottom: '1rem',
          border: `2px solid ${hasSlots ? colors.success.border : colors.danger.border}`
        }}
      >
        <p
          style={{
            fontSize: '0.875rem',
            color: hasSlots ? colors.success.text : colors.danger.text,
            margin: 0,
            fontWeight: '600',
            textAlign: 'center'
          }}
        >
          {professor.availableSlots} of {professor.totalSlots} slots available
        </p>
      </div>

      {hasSlots && (
        <button
          onClick={() => onRequestMentorship(professor.id)}
          style={{
            ...secondaryButton,
            width: '100%'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = `0 6px 20px ${colors.secondary.shadowHover}`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = `0 4px 12px ${colors.secondary.shadow}`;
          }}
        >
          <MessageSquare size={16} />
          Request Mentorship
        </button>
      )}
    </div>
  );
}