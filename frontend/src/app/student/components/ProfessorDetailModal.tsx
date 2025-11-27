import { X, BookOpen } from 'lucide-react';
import { colors, baseCard } from '../styles/styles';
import type { ProfessorWithUser } from '../../../api/types';

interface ProfessorDetailModalProps {
  isOpen: boolean;
  professor: ProfessorWithUser | null;
  onClose: () => void;
}

export default function ProfessorDetailModal({ isOpen, professor, onClose }: ProfessorDetailModalProps) {
  if (!isOpen || !professor) return null;

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
          ...baseCard,
          maxWidth: '500px',
          width: '90%',
          maxHeight: '80vh',
          overflow: 'auto',
          zIndex: 1001
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: colors.neutral.gray900 }}>
              {professor.name}
            </h2>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: colors.neutral.gray600 }}>
              {professor.email}
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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: '600', color: colors.neutral.gray600, letterSpacing: '0.5px', marginBottom: '0.25rem' }}>
              DEPARTMENT
            </p>
            <p style={{ margin: 0, fontSize: '1rem', fontWeight: 'bold', color: colors.neutral.gray900 }}>
              {professor.department}
            </p>
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: '600', color: colors.neutral.gray600, letterSpacing: '0.5px', marginBottom: '0.25rem' }}>
              AVAILABLE SLOTS
            </p>
            <p style={{ margin: 0, fontSize: '1rem', fontWeight: 'bold', color: colors.neutral.gray900 }}>
              {professor.available_slots}
            </p>
          </div>
        </div>

        {/* Bio */}
        {professor.bio && (
          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: '600', color: colors.neutral.gray600, letterSpacing: '0.5px', marginBottom: '0.5rem' }}>
              BIO
            </p>
            <p style={{ margin: 0, fontSize: '0.875rem', color: colors.neutral.gray900, lineHeight: '1.6' }}>
              {professor.bio}
            </p>
          </div>
        )}

        {/* Research Areas */}
        {professor.research_areas && professor.research_areas.length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <BookOpen size={16} color="#667eea" />
              <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: '600', color: colors.neutral.gray600, letterSpacing: '0.5px' }}>
                RESEARCH AREAS
              </p>
            </div>
            <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
              {professor.research_areas.map((area) => (
                <li
                  key={area}
                  style={{
                    fontSize: '0.875rem',
                    color: colors.neutral.gray900,
                    marginBottom: '0.375rem'
                  }}
                >
                  {area}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
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
