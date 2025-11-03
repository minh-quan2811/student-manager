import { useState } from 'react';
import { Upload, Plus, X } from 'lucide-react';
import { mockStudents, additionalStudents, faculties, years, type Student } from '../data/mockData';
import StudentDetailModal from './modals/StudentDetailModal';

export default function StudentBoard() {
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [filterFaculty, setFilterFaculty] = useState('all');
  const [filterYear, setFilterYear] = useState('all');
  const [editData, setEditData] = useState<Student | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newStudent, setNewStudent] = useState<Student>({
    id: '',
    name: '',
    class: '',
    faculty: 'Computer Science',
    year: 2024,
    gpa: 0,
    major: '',
    email: '',
    skills: [],
    bio: ''
  });

  const getFilteredStudents = () => {
    let filtered = students;
    
    if (filterFaculty !== 'all') {
      filtered = filtered.filter(s => s.faculty === filterFaculty);
    }
    
    if (filterYear !== 'all') {
      filtered = filtered.filter(s => s.year.toString() === filterYear);
    }
    
    return filtered;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setStudents([...students, ...additionalStudents]);
      alert(`File "${file.name}" uploaded! Added ${additionalStudents.length} new students.`);
      e.target.value = '';
    }
  };

  const handleSave = () => {
    if (editData) {
      setStudents(students.map(s => s.id === editData.id ? editData : s));
      setSelectedStudent(null);
      setEditData(null);
      alert('Student updated successfully!');
    }
  };

  const handleDelete = () => {
    if (selectedStudent && window.confirm(`Delete ${selectedStudent.name}?`)) {
      setStudents(students.filter(s => s.id !== selectedStudent.id));
      setSelectedStudent(null);
      setEditData(null);
      alert('Student deleted successfully!');
    }
  };

  const handleCreate = () => {
    if (!newStudent.name || !newStudent.email || !newStudent.major || !newStudent.class) {
      alert('Please fill in all required fields!');
      return;
    }

    const id = `S${String(students.length + 1).padStart(3, '0')}`;
    setStudents([...students, { ...newStudent, id }]);
    setShowCreateModal(false);
    setNewStudent({
      id: '',
      name: '',
      class: '',
      faculty: 'Computer Science',
      year: 2024,
      gpa: 0,
      major: '',
      email: '',
      skills: [],
      bio: ''
    });
    alert('Student created successfully!');
  };

  const openModal = (student: Student) => {
    setSelectedStudent(student);
    setEditData({...student});
  };

  const getGPAColor = (gpa: number) => {
    if (gpa >= 3.7) return { bg: '#dcfce7', color: '#166534' };
    if (gpa >= 3.0) return { bg: '#dbeafe', color: '#1e40af' };
    if (gpa >= 2.5) return { bg: '#fef3c7', color: '#92400e' };
    return { bg: '#fee2e2', color: '#991b1b' };
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
          Student Management ({getFilteredStudents().length})
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
            {faculties.map((f: string) => (
              <option key={f} value={f}>{f === 'all' ? 'All Faculties' : f}</option>
            ))}
          </select>

          <select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
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
            {years.map((y: string) => (
              <option key={y} value={y}>{y === 'all' ? 'All Years' : y}</option>
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

      {/* Student Cards Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
        gap: '1.25rem' 
      }}>
        {getFilteredStudents().map(student => {
          const gpaColors = getGPAColor(student.gpa);
          return (
            <div
              key={student.id}
              onClick={() => openModal(student)}
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
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(16, 185, 129, 0.15)';
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = '#10b981';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = '#e5e7eb';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    fontSize: '0.75rem', 
                    color: '#9ca3af', 
                    fontWeight: '600',
                    marginBottom: '0.25rem' 
                  }}>
                    {student.id}
                  </div>
                  <h3 style={{ 
                    fontSize: '1.25rem', 
                    fontWeight: '700', 
                    color: '#1f2937', 
                    margin: 0,
                    marginBottom: '0.25rem'
                  }}>
                    {student.name}
                  </h3>
                  <div style={{ 
                    fontSize: '0.875rem', 
                    color: '#6b7280',
                    fontWeight: '500'
                  }}>
                    {student.class}
                  </div>
                </div>
                <div style={{ 
                  padding: '0.375rem 0.875rem', 
                  backgroundColor: gpaColors.bg,
                  color: gpaColors.color,
                  borderRadius: '8px',
                  fontSize: '0.8125rem',
                  fontWeight: '700',
                  whiteSpace: 'nowrap',
                  marginLeft: '0.5rem'
                }}>
                  GPA {student.gpa.toFixed(2)}
                </div>
              </div>
              
              <div style={{ 
                padding: '0.75rem',
                backgroundColor: '#f9fafb',
                borderRadius: '10px',
                marginBottom: '0.75rem'
              }}>
                <div style={{ fontSize: '0.8125rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                  <span style={{ fontWeight: '600' }}>Major:</span> {student.major}
                </div>
                <div style={{ fontSize: '0.8125rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                  <span style={{ fontWeight: '600' }}>Faculty:</span> {student.faculty}
                </div>
                <div style={{ fontSize: '0.8125rem', color: '#6b7280' }}>
                  <span style={{ fontWeight: '600' }}>Year:</span> {student.year}
                </div>
              </div>
              
              {student.skills && student.skills.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                  {student.skills.slice(0, 3).map((skill, idx) => (
                    <span key={idx} style={{
                      padding: '0.25rem 0.625rem',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: 'white',
                      borderRadius: '6px',
                      fontSize: '0.6875rem',
                      fontWeight: '600'
                    }}>
                      {skill}
                    </span>
                  ))}
                  {student.skills.length > 3 && (
                    <span style={{
                      padding: '0.25rem 0.625rem',
                      backgroundColor: '#e5e7eb',
                      color: '#6b7280',
                      borderRadius: '6px',
                      fontSize: '0.6875rem',
                      fontWeight: '600'
                    }}>
                      +{student.skills.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Detail Modal */}
      {selectedStudent && editData && (
        <StudentDetailModal
          student={selectedStudent}
          editData={editData}
          setEditData={setEditData}
          onClose={() => { setSelectedStudent(null); setEditData(null); }}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div
          style={{
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
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '20px',
              padding: '2rem',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '85vh',
              overflow: 'auto',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                  Create Student
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0.25rem 0 0 0' }}>
                  Add a new student to the system
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
                  value={newStudent.name}
                  onChange={e => setNewStudent({ ...newStudent, name: e.target.value })}
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
                  value={newStudent.email}
                  onChange={e => setNewStudent({ ...newStudent, email: e.target.value })}
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
                  Class *
                </label>
                <input
                  type="text"
                  placeholder="e.g., CS-2024"
                  value={newStudent.class}
                  onChange={e => setNewStudent({ ...newStudent, class: e.target.value })}
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
                  Major *
                </label>
                <input
                  type="text"
                  value={newStudent.major}
                  onChange={e => setNewStudent({ ...newStudent, major: e.target.value })}
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
                  value={newStudent.faculty}
                  onChange={e => setNewStudent({ ...newStudent, faculty: e.target.value })}
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
                  {faculties.filter(f => f !== 'all').map((f: string) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                    Year
                  </label>
                  <input
                    type="number"
                    value={newStudent.year}
                    onChange={e => setNewStudent({ ...newStudent, year: parseInt(e.target.value) || 2024 })}
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
                    value={newStudent.gpa}
                    onChange={e => setNewStudent({ ...newStudent, gpa: parseFloat(e.target.value) || 0 })}
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

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                  Skills (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g., Python, Java, Machine Learning"
                  value={newStudent.skills?.join(', ') || ''}
                  onChange={e => setNewStudent({ ...newStudent, skills: e.target.value.split(',').map(s => s.trim()).filter(s => s) })}
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
              Create Student
            </button>
          </div>
        </div>
      )}
    </>
  );
}