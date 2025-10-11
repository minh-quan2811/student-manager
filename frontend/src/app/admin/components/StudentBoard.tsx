import { useState } from 'react';
import { Upload, X, Edit, Trash2 } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  class: string;
  faculty: string;
  year: number;
  gpa: number;
  major: string;
  email: string;
}

const initialMockStudents: Student[] = [
  { id: 'S001', name: 'John Doe', class: 'CS-2021', faculty: 'Computer Science', year: 2021, gpa: 3.8, major: 'Software Engineering', email: 'john@research.edu' },
  { id: 'S002', name: 'Jane Smith', class: 'EE-2022', faculty: 'Electrical Engineering', year: 2022, gpa: 3.9, major: 'Electronics', email: 'jane@research.edu' },
  { id: 'S003', name: 'Mike Johnson', class: 'CS-2021', faculty: 'Computer Science', year: 2021, gpa: 3.6, major: 'AI & ML', email: 'mike@research.edu' },
  { id: 'S004', name: 'Sarah Williams', class: 'ME-2023', faculty: 'Mechanical Engineering', year: 2023, gpa: 3.7, major: 'Robotics', email: 'sarah@research.edu' },
  { id: 'S005', name: 'Tom Brown', class: 'CS-2022', faculty: 'Computer Science', year: 2022, gpa: 3.5, major: 'Data Science', email: 'tom@research.edu' },
  { id: 'S006', name: 'Emily Davis', class: 'EE-2021', faculty: 'Electrical Engineering', year: 2021, gpa: 3.85, major: 'Power Systems', email: 'emily@research.edu' },
  { id: 'S007', name: 'David Lee', class: 'CS-2023', faculty: 'Computer Science', year: 2023, gpa: 3.92, major: 'Cybersecurity', email: 'david@research.edu' },
  { id: 'S008', name: 'Lisa Chen', class: 'ME-2022', faculty: 'Mechanical Engineering', year: 2022, gpa: 3.78, major: 'Thermodynamics', email: 'lisa@research.edu' },
];

export default function StudentBoard() {
  const [students, setStudents] = useState<Student[]>(initialMockStudents);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [filterFaculty, setFilterFaculty] = useState('all');
  const [filterYear, setFilterYear] = useState('all');
  const [editData, setEditData] = useState<Student | null>(null);

  const faculties = ['all', 'Computer Science', 'Electrical Engineering', 'Mechanical Engineering'];
  const years = ['all', '2021', '2022', '2023', '2024'];

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
      // Generate mock data on upload
      const newMockStudents: Student[] = [
        { id: 'S009', name: 'Alex Taylor', class: 'CS-2024', faculty: 'Computer Science', year: 2024, gpa: 3.95, major: 'Machine Learning', email: 'alex@research.edu' },
        { id: 'S010', name: 'Maria Garcia', class: 'EE-2023', faculty: 'Electrical Engineering', year: 2023, gpa: 3.88, major: 'Digital Systems', email: 'maria@research.edu' },
        { id: 'S011', name: 'James Wilson', class: 'ME-2024', faculty: 'Mechanical Engineering', year: 2024, gpa: 3.82, major: 'Mechatronics', email: 'james@research.edu' },
      ];
      
      setStudents([...students, ...newMockStudents]);
      alert(`File "${file.name}" uploaded! Added ${newMockStudents.length} new students.`);
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
    if (selectedStudent && confirm(`Delete ${selectedStudent.name}?`)) {
      setStudents(students.filter(s => s.id !== selectedStudent.id));
      setSelectedStudent(null);
      setEditData(null);
      alert('Student deleted successfully!');
    }
  };

  const openModal = (student: Student) => {
    setSelectedStudent(student);
    setEditData({...student});
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
            {faculties.map(f => (
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
            {years.map(y => (
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
        </div>
      </div>

      {/* Student Cards Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
        gap: '1.25rem' 
      }}>
        {getFilteredStudents().map(student => (
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
              <div>
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
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                borderRadius: '8px',
                fontSize: '0.8125rem',
                fontWeight: '700',
                boxShadow: '0 2px 6px rgba(16, 185, 129, 0.3)'
              }}>
                {student.gpa}
              </div>
            </div>
            
            <div style={{ 
              padding: '0.75rem',
              backgroundColor: '#f9fafb',
              borderRadius: '10px',
              marginTop: '0.75rem'
            }}>
              <div style={{ fontSize: '0.8125rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                <span style={{ fontWeight: '600' }}>Major:</span> {student.major}
              </div>
              <div style={{ fontSize: '0.8125rem', color: '#6b7280' }}>
                <span style={{ fontWeight: '600' }}>Faculty:</span> {student.faculty}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedStudent && editData && (
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
                  Edit Student
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0.25rem 0 0 0' }}>
                  Update student information
                </p>
              </div>
              <button 
                onClick={() => { setSelectedStudent(null); setEditData(null); }} 
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer',
                  padding: '0.25rem',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
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
                  <input
                    type={key === 'gpa' || key === 'year' ? 'number' : 'text'}
                    value={value}
                    onChange={(e) => setEditData({...editData, [key]: key === 'gpa' ? parseFloat(e.target.value) : key === 'year' ? parseInt(e.target.value) : e.target.value})}
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
    </>
  );
}