import { useState } from 'react';
import { Upload } from 'lucide-react';
import { studentsApi } from '../../../api';
import type { StudentWithUser } from '../../../api/types';
import StudentDetailModal from './modals/StudentDetailModal';

const faculties = ['all', 'Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'FAST'];
const years = ['all', '2020', '2021', '2022', '2023', '2024'];

interface StudentBoardProps {
  students: StudentWithUser[];
  setStudents: (students: StudentWithUser[]) => void;
}

export default function StudentBoard({ students, setStudents }: StudentBoardProps) {
  const [selectedStudent, setSelectedStudent] = useState<StudentWithUser | null>(null);
  const [filterFaculty, setFilterFaculty] = useState('all');
  const [filterYear, setFilterYear] = useState('all');
  const [editData, setEditData] = useState<StudentWithUser | null>(null);
  const getFilteredStudents = () => {
    let filtered = students;
    
    if (filterFaculty !== 'all') {
      filtered = filtered.filter(s => s.faculty === filterFaculty);
    }
    
    if (filterYear !== 'all') {
      filtered = filtered.filter(s => s.year === filterYear);
    }
    
    return filtered;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      alert(`CSV upload functionality would be implemented here for file: ${file.name}`);
      e.target.value = '';
    }
  };

  const handleSave = async () => {
    if (editData && selectedStudent) {
      try {
        const updated = await studentsApi.update(selectedStudent.id, {
          gpa: editData.gpa,
          major: editData.major,
          faculty: editData.faculty,
          year: editData.year,
          skills: editData.skills,
          bio: editData.bio,
          looking_for_group: editData.looking_for_group
        });
        
        setStudents(students.map(s => s.id === updated.id ? updated : s));
        setSelectedStudent(null);
        setEditData(null);
        alert('Student updated successfully!');
      } catch (error) {
        console.error('Failed to update student:', error);
        alert('Failed to update student. Please try again.');
      }
    }
  };

  const handleDelete = async () => {
    if (selectedStudent && window.confirm(`Delete ${selectedStudent.name}?`)) {
      try {
        await studentsApi.delete(selectedStudent.id);
        setStudents(students.filter(s => s.id !== selectedStudent.id));
        setSelectedStudent(null);
        setEditData(null);
        alert('Student deleted successfully!');
      } catch (error) {
        console.error('Failed to delete student:', error);
        alert('Failed to delete student. Please try again.');
      }
    }
  };

  const openModal = (student: StudentWithUser) => {
    setSelectedStudent(student);
    setEditData({ ...student });
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
                    ID: {student.student_id}
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
                    {student.email}
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

    </>
  );
}