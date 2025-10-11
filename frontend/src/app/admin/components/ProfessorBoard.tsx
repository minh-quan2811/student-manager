import React, { useState } from 'react';
import { Upload, Plus, X } from 'lucide-react';
import {
  mockProfessors,
  additionalProfessors,
  faculties,
  type Professor
} from '../data/mockData';
import ProfessorDetailModal from './modals/ProfessorDetailModal';

export default function ProfessorBoard() {
  const [professors, setProfessors] = useState<Professor[]>(mockProfessors);
  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(null);
  const [filterFaculty, setFilterFaculty] = useState<string>('all');
  const [editData, setEditData] = useState<Professor | null>(null);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newProfessor, setNewProfessor] = useState<Professor>({
    id: '',
    name: '',
    faculty: 'Computer Science',
    field: '',
    achievements: '',
    email: '',
    publications: 0
  });

  const getFilteredProfessors = () => {
    if (filterFaculty === 'all') return professors;
    return professors.filter(p => p.faculty === filterFaculty);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfessors(prev => [...prev, ...additionalProfessors]);
      alert(`File "${file.name}" uploaded! Added ${additionalProfessors.length} new professors.`);
      // reset input value so same file can be uploaded again if desired
      e.currentTarget.value = '';
    }
  };

  const handleSave = () => {
    if (editData) {
      setProfessors(prev => prev.map(p => (p.id === editData.id ? editData : p)));
      setSelectedProfessor(null);
      setEditData(null);
      alert('Professor updated successfully!');
    }
  };

  const handleDelete = () => {
    if (selectedProfessor && window.confirm(`Delete ${selectedProfessor.name}?`)) {
      setProfessors(prev => prev.filter(p => p.id !== selectedProfessor.id));
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
    setProfessors(prev => [...prev, { ...newProfessor, id }]);
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

          <label
            style={{
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
            }}
          >
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
                {professor.id}
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

      {/* Edit Modal (uses dynamic field rendering safely) */}
      {selectedProfessor && editData && (
        <div>
          {/* Use your ProfessorDetailModal component if you prefer; kept here to mirror your original usage */}
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
        </div>
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
                  onChange={e => setNewProfessor({ ...newProfessor, name: e.target.value })}
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
                  onChange={e => setNewProfessor({ ...newProfessor, faculty: e.target.value })}
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

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                  Research Field *
                </label>
                <input
                  type="text"
                  value={newProfessor.field}
                  onChange={e => setNewProfessor({ ...newProfessor, field: e.target.value })}
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
                  onChange={e => setNewProfessor({ ...newProfessor, email: e.target.value })}
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
                  onChange={e => setNewProfessor({ ...newProfessor, publications: parseInt(e.target.value) || 0 })}
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
                  onChange={e => setNewProfessor({ ...newProfessor, achievements: e.target.value })}
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
