import { useState } from 'react';
import { X, Edit, Trash2, Users, Award, FileText, GraduationCap } from 'lucide-react';
import type { Research, Professor, ResearchMember } from '../../data/mockData';
import { mockProfessors } from '../../data/mockData';

interface ResearchDetailModalProps {
  research: Research;
  editData: Research;
  setEditData: (data: Research) => void;
  onClose: () => void;
  onSave: () => void;
  onDelete: () => void;
}

export default function ResearchDetailModal({ 
  research, 
  editData, 
  setEditData, 
  onClose, 
  onSave, 
  onDelete 
}: ResearchDetailModalProps) {
  const [showPdf, setShowPdf] = useState(false);

  const getProfessors = (): Professor[] => {
    return mockProfessors.filter(p => research.professors.includes(p.id));
  };

  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return { bg: '#fef3c7', color: '#92400e' };
    if (rank === 2) return { bg: '#e0e7ff', color: '#3730a3' };
    if (rank === 3) return { bg: '#fecaca', color: '#991b1b' };
    return { bg: '#e5e7eb', color: '#374151' };
  };

  const rankColors = getRankBadgeColor(research.rank);
  const professors = getProfessors();

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '20px',
        maxWidth: '1200px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '2rem',
          borderRadius: '20px 20px 0 0',
          color: 'white',
          position: 'relative'
        }}>
          <button 
            onClick={onClose} 
            style={{ 
              position: 'absolute',
              top: '1.5rem',
              right: '1.5rem',
              background: 'rgba(255,255,255,0.2)', 
              border: 'none', 
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
          >
            <X size={24} color="white" />
          </button>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.25rem' }}>{research.id}</div>
              <h2 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, marginBottom: '0.5rem' }}>
                {research.groupName}
              </h2>
              <div style={{ fontSize: '1.125rem', opacity: 0.95, marginBottom: '0.75rem' }}>
                {research.topic}
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', fontSize: '0.9375rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Users size={18} />
                  {research.members} Members
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <GraduationCap size={18} />
                  {research.faculty}
                </span>
                <span>Year: {research.year}</span>
              </div>
            </div>
            <div style={{ 
              padding: '0.5rem 1.25rem', 
              backgroundColor: rankColors.bg,
              color: rankColors.color,
              borderRadius: '10px',
              fontSize: '1rem',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Award size={20} />
              Rank #{research.rank}
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', height: 'calc(90vh - 200px)' }}>
          {/* Left Sidebar - Team Members */}
          <div style={{ 
            borderRight: '1px solid #e5e7eb', 
            padding: '1.5rem',
            overflowY: 'auto'
          }}>
            <h3 style={{ 
              fontSize: '1.125rem', 
              fontWeight: 'bold', 
              color: '#1f2937', 
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Users size={20} />
              Team Members
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {research.teamMembers.map((member: ResearchMember, index: number) => (
                <div key={index} style={{
                  padding: '1rem',
                  backgroundColor: '#f9fafb',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                  e.currentTarget.style.borderColor = '#667eea';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                  e.currentTarget.style.borderColor = '#e5e7eb';
                }}>
                  <div style={{ 
                    fontSize: '0.9375rem', 
                    fontWeight: '700', 
                    color: '#1f2937',
                    marginBottom: '0.25rem'
                  }}>
                    {member.name}
                    {member.role === 'Team Leader' && (
                      <span style={{
                        marginLeft: '0.5rem',
                        padding: '0.125rem 0.5rem',
                        backgroundColor: '#667eea',
                        color: 'white',
                        borderRadius: '4px',
                        fontSize: '0.6875rem',
                        fontWeight: '700'
                      }}>
                        LEADER
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                    {member.role}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                    {member.major} • GPA: {member.gpa}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content Area */}
          <div style={{ display: 'flex', flexDirection: 'column', padding: '1.5rem', overflowY: 'auto' }}>
            {/* Professors Section */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ 
                fontSize: '1.125rem', 
                fontWeight: 'bold', 
                color: '#1f2937', 
                marginBottom: '1rem'
              }}>
                Faculty Advisors
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                {professors.map((prof: Professor) => (
                  <div key={prof.id} style={{
                    padding: '1.25rem',
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    borderRadius: '12px',
                    color: 'white',
                    boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
                  }}>
                    <div style={{ 
                      fontSize: '1.125rem', 
                      fontWeight: '700',
                      marginBottom: '0.25rem'
                    }}>
                      {prof.name}
                    </div>
                    <div style={{ fontSize: '0.875rem', opacity: 0.95, marginBottom: '0.5rem' }}>
                      {prof.field}
                    </div>
                    <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>
                      {prof.publications} Publications
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Abstract */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ 
                fontSize: '1.125rem', 
                fontWeight: 'bold', 
                color: '#1f2937', 
                marginBottom: '0.75rem'
              }}>
                Abstract
              </h3>
              <p style={{
                fontSize: '0.9375rem',
                lineHeight: '1.6',
                color: '#4b5563',
                padding: '1rem',
                backgroundColor: '#f9fafb',
                borderRadius: '10px',
                border: '1px solid #e5e7eb'
              }}>
                {research.abstract}
              </p>
            </div>

            {/* Research Paper */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ 
                fontSize: '1.125rem', 
                fontWeight: 'bold', 
                color: '#1f2937', 
                marginBottom: '0.75rem'
              }}>
                Research Paper
              </h3>
              
              {!showPdf ? (
                <button
                  onClick={() => setShowPdf(true)}
                  style={{
                    width: '100%',
                    padding: '1.25rem',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
                  }}
                >
                  <FileText size={24} />
                  View Research Paper (PDF)
                </button>
              ) : (
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setShowPdf(false)}
                    style={{
                      position: 'absolute',
                      top: '0.5rem',
                      right: '0.5rem',
                      padding: '0.5rem',
                      backgroundColor: '#dc2626',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '0.875rem',
                      zIndex: 10,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <X size={16} />
                    Close PDF
                  </button>
                  <iframe
                    src={research.paperPath}
                    style={{
                      width: '100%',
                      height: '600px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '12px'
                    }}
                    title="Research Paper"
                  />
                  <div style={{
                    marginTop: '0.75rem',
                    padding: '0.75rem',
                    backgroundColor: '#fef3c7',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    color: '#92400e'
                  }}>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div style={{ 
              display: 'flex', 
              gap: '1rem', 
              paddingTop: '1.5rem', 
              borderTop: '1px solid #e5e7eb',
              marginTop: 'auto'
            }}>
              <button
                onClick={onSave}
                style={{
                  flex: 1,
                  padding: '1rem',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.9375rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
                }}
              >
                <Edit size={18} />
                Save Changes
              </button>
              <button
                onClick={onDelete}
                style={{
                  flex: 1,
                  padding: '1rem',
                  backgroundColor: '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.9375rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 12px rgba(220, 38, 38, 0.4)'
                }}
              >
                <Trash2 size={18} />
                Delete Research
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}