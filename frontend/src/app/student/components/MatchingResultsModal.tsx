import { useState } from 'react';
import { X, ChevronRight } from 'lucide-react';
import { colors, baseCard } from '../styles/styles';
import type { MatchingResult, Candidate } from '../../../api/matching';

interface MatchingResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: MatchingResult | null;
  isLoading: boolean;
}

export default function MatchingResultsModal({
  isOpen,
  onClose,
  result,
  isLoading
}: MatchingResultsModalProps) {
  const [selectedCandidateId, setSelectedCandidateId] = useState<number | null>(null);

  if (!isOpen) return null;

  const selectedCandidate = selectedCandidateId
    ? result?.candidates.find(c => c.id === selectedCandidateId)
    : result?.selected_candidate;

  const renderCandidateDetail = (key: string, value: any): string => {
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value);
    }
    return String(value);
  };

  const formatKey = (key: string): string => {
    return key
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
          backdropFilter: 'blur(4px)'
        }}
      />
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: '1000px',
          maxHeight: '90vh',
          overflow: 'auto',
          ...baseCard,
          zIndex: 1001,
          padding: 0,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr'
        }}
      >
        {/* Left: Candidates List */}
        <div
          style={{
            borderRight: `2px solid ${colors.neutral.gray200}`,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <div
            style={{
              padding: '1.5rem',
              borderBottom: `2px solid ${colors.neutral.gray200}`,
              background: colors.primary.gradient,
              color: 'white'
            }}
          >
            <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>AI Matched Results</h2>
            <p style={{ margin: 0, fontSize: '0.875rem', opacity: 0.9 }}>
              {result?.candidates.length || 0} candidates analyzed
            </p>
          </div>

          <div style={{ flex: 1, overflow: 'auto', padding: '1rem' }}>
            {isLoading ? (
              <div
                style={{
                  padding: '2rem',
                  textAlign: 'center',
                  color: colors.neutral.gray600
                }}
              >
                Analyzing candidates...
              </div>
            ) : (
              result?.candidates.map((candidate, index) => {
                const isSelected = selectedCandidateId === candidate.id;
                const isBest = index === 0;

                return (
                  <div
                    key={candidate.id}
                    onClick={() => setSelectedCandidateId(candidate.id)}
                    style={{
                      padding: '1rem',
                      marginBottom: '0.75rem',
                      borderRadius: '12px',
                      border: isSelected ? '2px solid #667eea' : `2px solid ${colors.neutral.gray200}`,
                      background: isSelected ? 'rgba(102, 126, 234, 0.05)' : colors.neutral.white,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      position: 'relative'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#667eea';
                      e.currentTarget.style.boxShadow = `0 4px 12px ${colors.primary.shadow}`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = isSelected ? '#667eea' : colors.neutral.gray200;
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {isBest && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '-0.5rem',
                          right: '1rem',
                          padding: '0.25rem 0.75rem',
                          background: colors.success.gradient,
                          color: 'white',
                          borderRadius: '20px',
                          fontSize: '0.65rem',
                          fontWeight: 'bold',
                          letterSpacing: '0.5px'
                        }}
                      >
                        TOP MATCH
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 'bold', color: colors.neutral.gray900 }}>
                          {candidate.name}
                        </h3>
                        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', color: colors.neutral.gray600 }}>
                          {candidate.email}
                        </p>
                      </div>
                      {isSelected && <ChevronRight size={20} color="#667eea" />}
                    </div>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '0.375rem 0.75rem',
                        background: colors.neutral.gray100,
                        color: colors.neutral.gray900,
                        borderRadius: '6px',
                        fontSize: '0.65rem',
                        fontWeight: '600',
                        letterSpacing: '0.5px'
                      }}
                    >
                      {candidate.type.toUpperCase()}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Details Panel */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              padding: '1.5rem',
              borderBottom: `2px solid ${colors.neutral.gray200}`,
              background: colors.neutral.gray50,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 'bold', color: colors.neutral.gray900 }}>
              Profile Details
            </h3>
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

          <div style={{ flex: 1, overflow: 'auto', padding: '1.5rem' }}>
            {isLoading ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  color: colors.neutral.gray600
                }}
              >
                Loading details...
              </div>
            ) : selectedCandidate ? (
              <>
                <div style={{ marginBottom: '1.5rem' }}>
                  <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: colors.neutral.gray900, marginBottom: '0.25rem' }}>
                    {selectedCandidate.name}
                  </h2>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: colors.neutral.gray600 }}>
                    {selectedCandidate.email}
                  </p>
                  <div
                    style={{
                      marginTop: '0.75rem',
                      padding: '0.75rem',
                      background: 'rgba(102, 126, 234, 0.05)',
                      borderRadius: '8px',
                      borderLeft: '4px solid #667eea'
                    }}
                  >
                    <p style={{ margin: 0, fontSize: '0.875rem', color: colors.neutral.gray900, lineHeight: '1.6' }}>
                      <strong>AI Analysis:</strong> {result?.reasoning}
                    </p>
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: '600', color: colors.neutral.gray600, letterSpacing: '0.5px', marginBottom: '0.75rem' }}>
                    PROFILE INFORMATION
                  </p>
                  <div style={{ display: 'grid', gap: '0.75rem' }}>
                    {Object.entries(selectedCandidate.details).map(([key, value]) => (
                      <div key={key}>
                        <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: '600', color: colors.neutral.gray900, marginBottom: '0.25rem' }}>
                          {formatKey(key)}
                        </p>
                        {Array.isArray(value) && value.length > 0 ? (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {value.map((item, idx) => (
                              <span
                                key={idx}
                                style={{
                                  padding: '0.375rem 0.75rem',
                                  background: colors.warning.gradient,
                                  color: colors.warning.text,
                                  borderRadius: '6px',
                                  fontSize: '0.75rem',
                                  fontWeight: '600',
                                  border: `1px solid ${colors.warning.border}`
                                }}
                              >
                                {String(item)}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p style={{ margin: 0, fontSize: '0.875rem', color: colors.neutral.gray50 }}>
                            {renderCandidateDetail(key, value)}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <p style={{ color: colors.neutral.gray600, textAlign: 'center' }}>No candidate selected</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}