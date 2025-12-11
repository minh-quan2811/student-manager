import { useState } from 'react';
import { Upload } from 'lucide-react';
import { researchApi } from '../../../api';
import type { ResearchPaper } from '../../../api/types';
import ResearchDetailModal from './modals/ResearchDetailModal';

const faculties = ['all', 'Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'FAST'];
const years = ['all', '2020', '2021', '2022', '2023', '2024'];

interface ResearchBoardProps {
  research: ResearchPaper[];
  setResearch: (research: ResearchPaper[]) => void;
}

export default function ResearchBoard({ research, setResearch }: ResearchBoardProps) {
  const [selectedResearch, setSelectedResearch] = useState<ResearchPaper | null>(null);
  const [filterFaculty, setFilterFaculty] = useState('all');
  const [filterYear, setFilterYear] = useState('all');
  const [editData, setEditData] = useState<ResearchPaper | null>(null);

  const getFilteredResearch = () => {
    let filtered = research;
    
    if (filterFaculty !== 'all') {
      filtered = filtered.filter(r => r.faculty === filterFaculty);
    }
    
    if (filterYear !== 'all') {
      filtered = filtered.filter(r => r.year.toString() === filterYear);
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
    if (editData && selectedResearch) {
      try {
        const updated = await researchApi.update(selectedResearch.id, {
          group_name: editData.group_name,
          topic: editData.topic,
          description: editData.description,
          abstract: editData.abstract,
          faculty: editData.faculty,
          year: editData.year,
          rank: editData.rank,
          members: editData.members,
          leader: editData.leader,
          paper_path: editData.paper_path
        });
        
        setResearch(research.map(r => r.id === updated.id ? updated : r));
        setSelectedResearch(null);
        setEditData(null);
        alert('Research paper updated successfully!');
      } catch (error) {
        console.error('Failed to update research paper:', error);
        alert('Failed to update research paper. Please try again.');
      }
    }
  };

  const handleDelete = async () => {
    if (selectedResearch && window.confirm(`Delete ${selectedResearch.group_name}?`)) {
      try {
        await researchApi.delete(selectedResearch.id);
        setResearch(research.filter(r => r.id !== selectedResearch.id));
        setSelectedResearch(null);
        setEditData(null);
        alert('Research paper deleted successfully!');
      } catch (error) {
        console.error('Failed to delete research paper:', error);
        alert('Failed to delete research paper. Please try again.');
      }
    }
  };

  const openModal = (researchItem: ResearchPaper) => {
    setSelectedResearch(researchItem);
    setEditData({...researchItem});
  };

  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return { bg: '#fef3c7', color: '#92400e', shadow: 'rgba(251, 191, 36, 0.3)' };
    if (rank === 2) return { bg: '#e0e7ff', color: '#3730a3', shadow: 'rgba(99, 102, 241, 0.3)' };
    if (rank === 3) return { bg: '#fecaca', color: '#991b1b', shadow: 'rgba(239, 68, 68, 0.3)' };
    return { bg: '#e5e7eb', color: '#374151', shadow: 'rgba(107, 114, 128, 0.3)' };
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
          Research Management ({getFilteredResearch().length})
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

      {/* Research Cards Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
        gap: '1.25rem' 
      }}>
        {getFilteredResearch().map(researchItem => {
          const rankColors = getRankBadgeColor(researchItem.rank);
          return (
            <div
              key={researchItem.id}
              onClick={() => openModal(researchItem)}
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
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    fontSize: '0.75rem', 
                    color: '#9ca3af', 
                    fontWeight: '600',
                    marginBottom: '0.25rem' 
                  }}>
                    {researchItem.paper_id}
                  </div>
                  <h3 style={{ 
                    fontSize: '1.25rem', 
                    fontWeight: '700', 
                    color: '#1f2937', 
                    margin: 0,
                    marginBottom: '0.25rem'
                  }}>
                    {researchItem.group_name}
                  </h3>
                  <div style={{ 
                    fontSize: '0.875rem', 
                    color: '#6b7280',
                    fontWeight: '500'
                  }}>
                    {researchItem.topic}
                  </div>
                </div>
                <div style={{ 
                  padding: '0.375rem 0.875rem', 
                  backgroundColor: rankColors.bg,
                  color: rankColors.color,
                  borderRadius: '8px',
                  fontSize: '0.8125rem',
                  fontWeight: '700',
                  boxShadow: `0 2px 6px ${rankColors.shadow}`,
                  whiteSpace: 'nowrap',
                  marginLeft: '0.5rem'
                }}>
                  Rank #{researchItem.rank}
                </div>
              </div>
              
              <div style={{ 
                padding: '0.75rem',
                backgroundColor: '#f9fafb',
                borderRadius: '10px',
                marginBottom: '0.75rem'
              }}>
                <div style={{ fontSize: '0.8125rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                  <span style={{ fontWeight: '600' }}>Leader:</span> {researchItem.leader}
                </div>
                <div style={{ fontSize: '0.8125rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                  <span style={{ fontWeight: '600' }}>Faculty:</span> {researchItem.faculty}
                </div>
                <div style={{ fontSize: '0.8125rem', color: '#6b7280' }}>
                  <span style={{ fontWeight: '600' }}>Members:</span> {researchItem.members} • <span style={{ fontWeight: '600' }}>Year:</span> {researchItem.year}
                </div>
              </div>
              
              <div style={{ fontSize: '0.75rem', color: '#6b7280', lineHeight: '1.4' }}>
                {researchItem.description.substring(0, 70)}...
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Modal */}
      {selectedResearch && editData && (
        <ResearchDetailModal
          research={selectedResearch}
          editData={editData}
          setEditData={setEditData}
          onClose={() => { setSelectedResearch(null); setEditData(null); }}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
    </>
  );
}