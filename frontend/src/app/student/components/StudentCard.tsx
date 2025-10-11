import { UserPlus } from 'lucide-react';

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
}

export default function StudentCard({ student, onInvite }: StudentCardProps) {
  return (
    <div
      style={{
        background: 'white',
        borderRadius: '16px',
        padding: '1.5rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease'
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1.25rem',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
            }}
          >
            {student.name[0]}
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 'bold', color: '#1f2937' }}>
              {student.name}
            </h3>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>{student.year}</p>
          </div>
        </div>
        {student.lookingForGroup && (
          <span
            style={{
              padding: '0.25rem 0.75rem',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              borderRadius: '8px',
              fontSize: '0.75rem',
              fontWeight: '600',
              boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
            }}
          >
            Looking
          </span>
        )}
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 0.5rem 0', lineHeight: '1.5' }}>
          {student.bio}
        </p>
        <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.75rem', color: '#6b7280' }}>
          <span>
            <strong style={{ color: '#1f2937' }}>Major:</strong> {student.major}
          </span>
          <span>•</span>
          <span>
            <strong style={{ color: '#1f2937' }}>GPA:</strong> {student.gpa}
          </span>
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem', letterSpacing: '0.5px' }}>
          SKILLS
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {student.skills.map((skill) => (
            <span
              key={skill}
              style={{
                padding: '0.375rem 0.875rem',
                background: '#f3f4f6',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '0.75rem',
                color: '#1f2937',
                fontWeight: '500'
              }}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <button
        onClick={() => onInvite(student.id)}
        style={{
          width: '100%',
          padding: '0.75rem',
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
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
          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
        }}
      >
        <UserPlus size={16} />
        Invite to Group
      </button>
    </div>
  );
}
