import { useState } from 'react';
import { Upload, X, Edit, Trash2, Plus } from 'lucide-react';

interface Professor {
  id: string;
  name: string;
  faculty: string;
  field: string;
  achievements: string;
  email: string;
  publications: number;
}

const initialMockProfessors: Professor[] = [
  { id: 'P001', name: 'Dr. Robert Chen', faculty: 'Computer Science', field: 'Machine Learning', achievements: 'Published 50+ papers, IEEE Fellow', email: 'robert.chen@research.edu', publications: 52 },
  { id: 'P002', name: 'Dr. Emily Zhang', faculty: 'Electrical Engineering', field: 'Signal Processing', achievements: 'NSF Career Award, 30+ patents', email: 'emily.zhang@research.edu', publications: 45 },
  { id: 'P003', name: 'Dr. James Wilson', faculty: 'Computer Science', field: 'Distributed Systems', achievements: 'ACM Distinguished Scientist', email: 'james.wilson@research.edu', publications: 38 },
  { id: 'P004', name: 'Dr. Lisa Martinez', faculty: 'Mechanical Engineering', field: 'Robotics', achievements: 'Best Paper Award 2023', email: 'lisa.martinez@research.edu', publications: 41 },
  { id: 'P005', name: 'Dr. Michael Brown', faculty: 'Computer Science', field: 'Cybersecurity', achievements: 'Google Faculty Research Award', email: 'michael.brown@research.edu', publications: 35 },
  { id: 'P006', name: 'Dr. Sarah Johnson', faculty: 'Electrical Engineering', field: 'Power Systems', achievements: 'IEEE Outstanding Engineer Award', email: 'sarah.johnson@research.edu', publications: 48 },
];

export default function ProfessorBoard() {
  const [professors, setProfessors] = useState<Professor[]>(initialMockProfessors);
  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(null);
  const [filterFaculty, setFilterFaculty] = useState('all');
  const [editData, setEditData] = useState<Professor | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProfessor, setNewProfessor] = useState<Professor>({
    id: '',
    name: '',
    faculty: 'Computer Science',
    field: '',
    achievements: '',
    email: '',
    publications: 0
  });

  const faculties = ['all', 'Computer Science', 'Electrical Engineering', 'Mechanical Engineering'];

  const getFilteredProfessors = () => {
    if (filterFaculty === 'all') return professors;
    return professors.filter(p => p.faculty === filterFaculty);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newMockProfessors: Professor[] = [
        { id: 'P007', name: 'Dr. David Kim', faculty: 'Computer Science', field: 'Natural Language Processing', achievements: 'AAAI Fellow, 40+ papers', email: 'david.kim@research.edu', publications: 42 },
        { id: 'P008', name: 'Dr. Anna White', faculty: 'Mechanical Engineering', field: 'Thermodynamics', achievements: 'ASME Medal, 35+ publications', email: 'anna.white@research.edu', publications: 37 },
      ];
      
      setProfessors([...professors, ...newMockProfessors]);
      alert(`File "${file.name}" uploaded! Added ${newMockProfessors.length} new professors.`);
      e.target.value = '';
    }
  };

  const handleSave = () => {
    if (editData) {
      setProfessors(professors.map(p => p.id === editData.id ? editData : p));
      setSelectedProfessor(null);
      setEditData(null);
      alert('Professor updated successfully!');
    }
  };

  const handleDelete = () => {
    if (selectedProfessor && confirm(`Delete ${selectedProfessor.name}?`)) {
      setProfessors(professors.filter(p => p.id !== selectedProfessor.id));
      setSelectedProfessor(null);
      setEditData(null);
      alert('Professor deleted successfully!');
    }
  };

  const handleCreate = () => {
    if (!newProfessor.name || !newProfessor.field || !newProfessor.email) {
      alert('Please fill in all required fields!');
      return;
    }
    
    const id = `P${String(professors.length + 1).padStart(3, '0')}`;
    setProfessors([...professors, { ...newProfessor, id }]);
    setShowCreateModal(false);
    setNewProfessor({
      id: '',
      name: '',
      faculty: 'Computer Science',
      field: '',
      achievements: '',
      email: '',
      publications: 0
    });
    alert('Professor created successfully!');
  };

  const openModal = (professor: Professor) => {
    setSelectedProfessor(professor);
    setEditData({...professor});
  };

  return (
    <>
      {/* Filters and Actions */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <h2 style={{ 
          fontSize: '1.5rem', 
          fontWeight: 'bold', 
          color: '#1f2937',
          margin: 0
        }}>
          Professor Management ({getFilteredProfessors().length})
        </h2>
        
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <select
            value={filterFaculty}
            onChange={(e) => setFilterFaculty(e.target.value)}
            style={{
              padding: '0.625rem 1rem',
              border: '2px solid #e5e7eb',
              borderRadius: '10px',
              fontSize: '0.875rem',
              cursor: 'pointer',
              backgroundColor: 'white',
              fontWeight: '500',
              color: '#374151'
            }}
          >
            {faculties.map(f => (
              <option key={f} value={f}>{f === 'all' ? 'All Faculties' : f}</option>
            ))}
          </select>

          <label style={{
            padding: '0.625rem 1.25rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: '10px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '600',
            boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
            transition: 'all 0.3s'
          }}>
            <Upload size={16} />
            Upload CSV
            <input type="file" accept=".csv" onChange={handleFileUpload} style={{ display: 'none' }} />
          </label>

          <button
            onClick={() => setShowCreateModal(true)}
            style={{
              padding: '0.625rem 1.25rem',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '600',
              boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
              transition: 'all 0.3s'
            }}
          >
            <Plus size={16} />
            Create
          </button>
        </div>
      </div>

      {/* Professor Cards Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
        gap: '1.25rem' 
      }}>
        {getFilteredProfessors().map(professor => (
          <div
            key={professor.id}
            onClick={() => openModal(professor)}
            style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '16px',
              border: '1px solid #e5e7eb',
              cursor: 'pointer',
              transition: 'all 0.3s',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.15)';
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.borderColor = '#667eea';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = '#e5e7eb';
            }}
          >
            <div style={{ marginBottom: '0.75rem' }}>
              <div style={{ 
                fontSize: '0.75rem', 
                color: '#9ca3af', 
                fontWeight: '600',
                marginBottom: '0.25rem' 
              }}>
                {professor.id}
              </div>
              <h3 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '700', 
                color: '#1f2937', 
                margin: 0,
                marginBottom: '0.5rem'
              }}>
                {professor.name}
              </h3>
              <div style={{ 
                display: 'inline-block',
                padding: '0.25rem 0.75rem',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: 'white',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: '700',
                marginBottom: '0.5rem'
              }}>
                {professor.field}
              </div>
            </div>
            
            <div style={{ 
              padding: '0.75rem',
              backgroundColor: '#f9fafb',
              borderRadius: '10px',
              marginBottom: '0.75rem'
            }}>
              <div style={{ fontSize: '0.8125rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                <span style={{ fontWeight: '600' }}>Faculty:</span> {professor.faculty}
              </div>
              <div style={{ fontSize: '0.8125rem', color: '#6b7280' }}>
                <span style={{ fontWeight: '600' }}>Publications:</span> {professor.publications}
              </div>
            </div>
            
            <div style={{ fontSize: '0.75rem', color: '#6b7280', lineHeight: '1.4' }}>
              {professor.achievements.substring(0, 60)}...
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {selectedProfessor && editData && (
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
            padding: '2rem',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '85vh',
            overflow: 'auto',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                  Edit Professor
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0.25rem 0 0 0' }}>
                  Update professor information
                </p>
              </div>
              <button 
                onClick={() => { setSelectedProfessor(null); setEditData(null); }} 
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer',
                  padding: '0.25rem',
                  borderRadius: '6px'
                }}
              >
                <X size={24} color="#6b7280" />
              </button>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              {Object.entries(editData).map(([key, value]) => (
                <div key={key} style={{ marginBottom: '1.25rem' }}>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.875rem', 
                    fontWeight: '600', 
                    color: '#374151', 
                    marginBottom: '0.5rem', 
                    textTransform: 'capitalize' 
                  }}>
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  {key === 'achievements' ? (
                    <textarea
                      value={value}
                      onChange={(e) => setEditData({...editData, [key]: e.target.value})}
                      rows={3}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        border: '2px solid #e5e7eb',
                        borderRadius: '10px',
                        fontSize: '0.9375rem',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                        boxSizing: 'border-box',
                        fontFamily: 'inherit',
                        resize: 'vertical'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#667eea'}
                      onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                    />
                  ) : (
                    <input
                      type={key === 'publications' ? 'number' : 'text'}
                      value={value}
                      onChange={(e) => setEditData({...editData, [key]: key === 'publications' ? parseInt(e.target.value) : e.target.value})}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        border: '2px solid #e5e7eb',
                        borderRadius: '10px',
                        fontSize: '0.9375rem',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                        boxSizing: 'border-box'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#667eea'}
                      onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                    />
                  )}
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={handleSave}
                style={{
                  flex: 1,
                  padding: '0.875rem',
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
                onClick={handleDelete}
                style={{
                  flex: 1,
                  padding: '0.875rem',
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
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
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
            padding: '2rem',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '85vh',
            overflow: 'auto',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                  Create Professor
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0.25rem 0 0 0' }}>
                  Add a new professor to the system
                </p>
              </div>
              <button 
                onClick={() => setShowCreateModal(false)} 
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer',
                  padding: '0.25rem'
                }}
              >
                <X size={24} color="#6b7280" />
              </button>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                  Name *
                </label>
                <input
                  type="text"
                  value={newProfessor.name}
                  onChange={(e) => setNewProfessor({...newProfessor, name: e.target.value})}
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
                  Faculty *
                </label>
                <select
                  value={newProfessor.faculty}
                  onChange={(e) => setNewProfessor({...newProfessor, faculty: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '10px',
                    fontSize: '0.9375rem',
                    cursor: 'pointer',
                    boxSizing: 'border-box'
                  }}
                >
                  {faculties.filter(f => f !== 'all').map(f => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                  Research Field *
                </label>
                <input
                  type="text"
                  value={newProfessor.field}
                  onChange={(e) => setNewProfessor({...newProfessor, field: e.target.value})}
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
                  Email *
                </label>
                <input
                  type="email"
                  value={newProfessor.email}
                  onChange={(e) => setNewProfessor({...newProfessor, email: e.target.value})}
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
                  Publications
                </label>
                <input
                  type="number"
                  value={newProfessor.publications}
                  onChange={(e) => setNewProfessor({...newProfessor, publications: parseInt(e.target.value) || 0})}
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
                  Achievements
                </label>
                <textarea
                  value={newProfessor.achievements}
                  onChange={(e) => setNewProfessor({...newProfessor, achievements: e.target.value})}
                  rows={3}
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

            <button
              onClick={handleCreate}
              style={{
                width: '100%',
                padding: '0.875rem',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
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
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)'
              }}
            >
              <Plus size={18} />
              Create Professor
            </button>
          </div>
        </div>
      )}
    </>
  );
}