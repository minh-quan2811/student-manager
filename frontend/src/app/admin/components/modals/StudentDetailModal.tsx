import { X, Edit, Trash2, Mail, GraduationCap, Award } from 'lucide-react';
import type { StudentWithUser } from '../../../../api/types';

interface StudentDetailModalProps {
  student: StudentWithUser;
  editData: StudentWithUser;
  setEditData: (data: StudentWithUser) => void;
  onClose: () => void;
  onSave: () => void;
  onDelete: () => void;
}

export default function StudentDetailModal({ 
  student, 
  editData, 
  setEditData, 
  onClose, 
  onSave, 
  onDelete 
}: StudentDetailModalProps) {
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
        maxWidth: '900px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{
              width: '100px',
              height: '100px',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.5rem',
              fontWeight: 'bold',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255,255,255,0.3)'
            }}>
              {student.name.charAt(0)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.25rem' }}>{student.id}</div>
              <h2 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, marginBottom: '0.5rem' }}>
                {student.name}
              </h2>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', fontSize: '0.9375rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <GraduationCap size={18} />
                  {student.year}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Award size={18} />
                  GPA: {student.gpa}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
            {/* Basic Info */}
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
                Basic Information
              </h3>
              
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                  Email
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', backgroundColor: '#f9fafb', borderRadius: '10px' }}>
                  <Mail size={16} color="#6b7280" />
                  <input
                    type="email"
                    value={editData.email}
                    onChange={(e) => setEditData({...editData, email: e.target.value})}
                    style={{
                      border: 'none',
                      backgroundColor: 'transparent',
                      outline: 'none',
                      flex: 1,
                      fontSize: '0.9375rem'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                  Major
                </label>
                <input
                  type="text"
                  value={editData.major}
                  onChange={(e) => setEditData({...editData, major: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '10px',
                    fontSize: '0.9375rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                  Faculty
                </label>
                <input
                  type="text"
                  value={editData.faculty}
                  onChange={(e) => setEditData({...editData, faculty: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '10px',
                    fontSize: '0.9375rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                    Year
                  </label>
                  <input
                    type="number"
                    value={editData.year}
                    onChange={(e) => setEditData({...editData, year: parseInt(e.target.value)})}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '10px',
                      fontSize: '0.9375rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                    GPA
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editData.gpa}
                    onChange={(e) => setEditData({...editData, gpa: parseFloat(e.target.value)})}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '10px',
                      fontSize: '0.9375rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Skills & Bio */}
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
                Skills & Bio
              </h3>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                  Skills
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  {editData.skills?.map((skill: string, index: number) => (
                    <span key={index} style={{
                      padding: '0.375rem 0.75rem',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: 'white',
                      borderRadius: '6px',
                      fontSize: '0.8125rem',
                      fontWeight: '600'
                    }}>
                      {skill}
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Add skills (comma-separated)"
                  value={editData.skills?.join(', ') || ''}
                  onChange={(e) => setEditData({...editData, skills: e.target.value.split(',').map(s => s.trim())})}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '10px',
                    fontSize: '0.9375rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                  Bio
                </label>
                <textarea
                  value={editData.bio || ''}
                  onChange={(e) => setEditData({...editData, bio: e.target.value})}
                  rows={6}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '10px',
                    fontSize: '0.9375rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '1rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb' }}>
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
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                transition: 'all 0.3s'
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
                boxShadow: '0 4px 12px rgba(220, 38, 38, 0.4)',
                transition: 'all 0.3s'
              }}
            >
              <Trash2 size={18} />
              Delete Student
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}