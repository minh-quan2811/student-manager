import { X } from 'lucide-react';
import { colors } from '../styles/styles';
import type { StudentWithUser } from '../../../api/types';

interface StudentDetailModalProps {
  isOpen: boolean;
  student: StudentWithUser | null;
  onClose: () => void;
}

export default function StudentDetailModal({ isOpen, student, onClose }: StudentDetailModalProps) {
  if (!isOpen || !student) return null;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}
      />
      
      {/* Modal */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: colors.neutral.white,
          borderRadius: '12px',
          padding: '1rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          maxWidth: '420px',
          width: '95%',
          maxHeight: '90vh',
          overflow: 'auto',
          zIndex: 1001
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold', color: colors.neutral.gray900 }}>
              {student.name}
            </h2>
            <p style={{ margin: '0.125rem 0 0 0', fontSize: '0.75rem', color: colors.neutral.gray600 }}>
              {student.email}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: colors.neutral.gray600,
              padding: '0.25rem'
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
          <div>
            <p style={{ margin: 0, fontSize: '0.65rem', fontWeight: '600', color: colors.neutral.gray600, letterSpacing: '0.5px', marginBottom: '0.2rem' }}>
              GPA
            </p>
            <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 'bold', color: colors.neutral.gray900 }}>
              {student.gpa?.toFixed(2) || 'N/A'}
            </p>
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '0.65rem', fontWeight: '600', color: colors.neutral.gray600, letterSpacing: '0.5px', marginBottom: '0.2rem' }}>
              MAJOR
            </p>
            <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 'bold', color: colors.neutral.gray900 }}>
              {student.major}
            </p>
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '0.65rem', fontWeight: '600', color: colors.neutral.gray600, letterSpacing: '0.5px', marginBottom: '0.2rem' }}>
              YEAR
            </p>
            <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 'bold', color: colors.neutral.gray900 }}>
              {student.year}
            </p>
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '0.65rem', fontWeight: '600', color: colors.neutral.gray600, letterSpacing: '0.5px', marginBottom: '0.2rem' }}>
              STATUS
            </p>
            <p style={{
              margin: 0,
              fontSize: '0.75rem',
              fontWeight: '600',
              padding: '0.25rem 0.5rem',
              background: student.looking_for_group ? colors.success.light : colors.neutral.gray100,
              color: student.looking_for_group ? colors.success.text : colors.neutral.gray600,
              borderRadius: '6px',
              width: 'fit-content'
            }}>
              {student.looking_for_group ? 'Looking' : 'Not Looking'}
            </p>
          </div>
        </div>

        {/* Bio */}
        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: '600', color: colors.neutral.gray600, letterSpacing: '0.5px', marginBottom: '0.5rem' }}>
            BIO
          </p>
          <p style={{ margin: 0, fontSize: '0.875rem', color: colors.neutral.gray900, lineHeight: '1.6' }}>
            {student.bio || 'No bio provided'}
          </p>
        </div>

        {/* Skills */}
        {student.skills && student.skills.length > 0 && (
          <div>
            <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: '600', color: colors.neutral.gray600, letterSpacing: '0.5px', marginBottom: '0.5rem' }}>
              SKILLS
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {student.skills.map((skill) => (
                <span
                  key={skill}
                  style={{
                    padding: '0.375rem 0.875rem',
                    background: colors.primary.gradient,
                    color: 'white',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: '600'
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            marginTop: '1.5rem',
            width: '100%',
            padding: '0.75rem',
            background: colors.neutral.gray200,
            border: 'none',
            borderRadius: '8px',
            fontSize: '0.875rem',
            fontWeight: '600',
            color: colors.neutral.gray900,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = colors.neutral.gray100;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = colors.neutral.gray200;
          }}
        >
          Close
        </button>
      </div>
    </>
  );
}
