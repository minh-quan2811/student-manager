import { useState } from 'react';
import { Upload, Plus } from 'lucide-react';
import { professorsApi } from '../../../api';
import type { ProfessorWithUser } from '../../../api/types';
import ProfessorDetailModal from './modals/ProfessorDetailModal';
import CreateAccountModal from './CreateAccountModal';
import CSVUploadModal from './CSVUploadModal';

const faculties = ['all', 'Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'FAST'];

interface ProfessorBoardProps {
  professors: ProfessorWithUser[];
  setProfessors: (professors: ProfessorWithUser[]) => void;
}

export default function ProfessorBoard({ professors, setProfessors }: ProfessorBoardProps) {
  const [selectedProfessor, setSelectedProfessor] = useState<ProfessorWithUser | null>(null);
  const [filterFaculty, setFilterFaculty] = useState<string>('all');
  const [editData, setEditData] = useState<ProfessorWithUser | null>(null);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showCSVModal, setShowCSVModal] = useState<boolean>(false);

  const getFilteredProfessors = () => {
    if (filterFaculty === 'all') return professors;
    return professors.filter(p => p.faculty === filterFaculty);
  };

  const handleSave = async () => {
    if (editData && selectedProfessor) {
      try {
        const updated = await professorsApi.update(selectedProfessor.id, {
          faculty: editData.faculty,
          field: editData.field,
          department: editData.department,
          research_areas: editData.research_areas,
          research_interests: editData.research_interests,
          achievements: editData.achievements,
          publications: editData.publications,
          bio: editData.bio,
          available_slots: editData.available_slots,
          total_slots: editData.total_slots
        });
        
        setProfessors(professors.map(p => p.id === updated.id ? updated : p));
        setSelectedProfessor(null);
        setEditData(null);
        alert('Professor updated successfully!');
      } catch (error) {
        console.error('Failed to update professor:', error);
        alert('Failed to update professor. Please try again.');
      }
    }
  };

  const handleDelete = async () => {
    if (selectedProfessor && window.confirm(`Delete ${selectedProfessor.name}?`)) {
      try {
        await professorsApi.delete(selectedProfessor.id);
        setProfessors(professors.filter(p => p.id !== selectedProfessor.id));
        setSelectedProfessor(null);
        setEditData(null);
        alert('Professor deleted successfully!');
      } catch (error) {
        console.error('Failed to delete professor:', error);
        alert('Failed to delete professor. Please try again.');
      }
    }
  };

  const openModal = (professor: ProfessorWithUser) => {
    setSelectedProfessor(professor);
    setEditData({ ...professor });
  };

  return (
    <>
      {/* Filters and Actions */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <h2
          style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#1f2937',
            margin: 0
          }}
        >
          Professor Management ({getFilteredProfessors().length})
        </h2>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <select
            value={filterFaculty}
            onChange={e => setFilterFaculty(e.target.value)}
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
              <option key={f} value={f}>
                {f === 'all' ? 'All Faculties' : f}
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowCSVModal(true)}
            style={{
              padding: '0.625rem 1.25rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '600',
              boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
              transition: 'all 0.3s'
            }}
          >
            <Upload size={16} />
            Upload CSV
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            style={{
              padding: '0.625rem 1.25rem',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '600',
              boxShadow: '0 2px 8px rgba(245, 158, 11, 0.3)',
              transition: 'all 0.3s'
            }}
          >
            <Plus size={16} />
            Create Professor
          </button>
        </div> 
      </div>

      {/* Professor Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.25rem'
        }}
      >
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
            onMouseEnter={e => {
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.15)';
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.borderColor = '#667eea';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = '#e5e7eb';
            }}
          >
            <div style={{ marginBottom: '0.75rem' }}>
              <div
                style={{
                  fontSize: '0.75rem',
                  color: '#9ca3af',
                  fontWeight: '600',
                  marginBottom: '0.25rem'
                }}
              >
                ID: {professor.professor_id}
              </div>
              <h3
                style={{
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  color: '#1f2937',
                  margin: 0,
                  marginBottom: '0.5rem'
                }}
              >
                {professor.name}
              </h3>
              <div
                style={{
                  display: 'inline-block',
                  padding: '0.25rem 0.75rem',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  color: 'white',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  marginBottom: '0.5rem'
                }}
              >
                {professor.field}
              </div>
            </div>

            <div
              style={{
                padding: '0.75rem',
                backgroundColor: '#f9fafb',
                borderRadius: '10px',
                marginBottom: '0.75rem'
              }}
            >
              <div style={{ fontSize: '0.8125rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                <span style={{ fontWeight: '600' }}>Faculty:</span> {professor.faculty}
              </div>
              <div style={{ fontSize: '0.8125rem', color: '#6b7280' }}>
                <span style={{ fontWeight: '600' }}>Publications:</span> {professor.publications}
              </div>
            </div>

            <div style={{ fontSize: '0.75rem', color: '#6b7280', lineHeight: '1.4' }}>
              {professor.achievements ? `${professor.achievements.substring(0, 60)}...` : '—'}
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {selectedProfessor && editData && (
        <ProfessorDetailModal
          professor={selectedProfessor}
          editData={editData}
          setEditData={setEditData}
          onClose={() => {
            setSelectedProfessor(null);
            setEditData(null);
          }}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}

      {/* Create Account Modal - Using API */}
      <CreateAccountModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        accountType="professor"
        onSubmit={async (accountData) => {
          try {
            const newProfessor = await professorsApi.createAccount(accountData);
            setProfessors([newProfessor, ...professors]);
            setShowCreateModal(false);
            alert('Professor account created successfully!');
          } catch (error: any) {
            console.error('Failed to create professor:', error);
            alert(`Failed to create professor account: ${error.response?.data?.detail || error.message}`);
            throw error;
          }
        }}
      />

      {/* CSV Upload Modal - Using API */}
      <CSVUploadModal
        isOpen={showCSVModal}
        onClose={() => setShowCSVModal(false)}
        accountType="professor"
        onSubmit={async (professorsData) => {
          try {
            const result = await professorsApi.createBulk(professorsData);
            
            // Check if any accounts were created
            if (result.success === 0) {
              const errorDetails = result.errors && result.errors.length > 0 
                ? result.errors.join('\n') 
                : 'No accounts were created. Please check the CSV format.';
              throw new Error(errorDetails);
            }
            
            // Refresh the professors list
            const updatedProfessors = await professorsApi.getAll();
            setProfessors(updatedProfessors);
            
            setShowCSVModal(false);
            
            // Show detailed success message
            let message = `Successfully created ${result.success} professor account(s)!`;
            if (result.failed > 0) {
              message += `\n\n${result.failed} failed:\n${result.errors.join('\n')}`;
            }
            alert(message);
          } catch (error: any) {
            console.error('Failed to create professors:', error);
            alert(error.message || 'Failed to create any accounts. Please check the CSV format and try again.');
            throw error;
          }
        }}
      />
    </>
  );
}