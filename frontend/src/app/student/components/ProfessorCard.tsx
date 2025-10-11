import { MessageSquare, Award } from 'lucide-react';

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
}

export default function ProfessorCard({ professor, onRequestMentorship }: ProfessorCardProps) {
  const hasSlots = professor.availableSlots > 0;

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
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <div
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '1.5rem',
            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
          }}
        >
          {professor.name.split(' ')[1][0]}
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937' }}>
            {professor.name}
          </h3>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Award size={14} />
            {professor.department}
          </p>
        </div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem', letterSpacing: '0.5px' }}>
          RESEARCH AREAS
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {professor.researchAreas.map((area) => (
            <span
              key={area}
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
              {area}
            </span>
          ))}
        </div>
      </div>

      <div
        style={{
          padding: '1rem',
          background: hasSlots 
            ? 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)' 
            : 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
          borderRadius: '12px',
          marginBottom: '1rem',
          border: `2px solid ${hasSlots ? '#bbf7d0' : '#fecaca'}`
        }}
      >
        <p
          style={{
            fontSize: '0.875rem',
            color: hasSlots ? '#166534' : '#991b1b',
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
            width: '100%',
            padding: '0.75rem',
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
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
            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(245, 158, 11, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(245, 158, 11, 0.3)';
          }}
        >
          <MessageSquare size={16} />
          Request Mentorship
        </button>
      )}
    </div>
  );
}