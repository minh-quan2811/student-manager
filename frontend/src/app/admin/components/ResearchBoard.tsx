import { useState } from 'react';
import { Upload, X, Edit, Trash2 } from 'lucide-react';

interface Research {
  id: string;
  groupName: string;
  faculty: string;
  year: number;
  rank: number;
  members: number;
  topic: string;
  leader: string;
  description: string;
}

const initialMockResearch: Research[] = [
  { id: 'R001', groupName: 'AI Vision Team', faculty: 'Computer Science', year: 2024, rank: 1, members: 4, topic: 'Computer Vision for Healthcare', leader: 'John Doe', description: 'Developing AI-powered diagnostic tools using computer vision' },
  { id: 'R002', groupName: 'Smart Grid', faculty: 'Electrical Engineering', year: 2024, rank: 2, members: 3, topic: 'IoT Energy Management', leader: 'Jane Smith', description: 'Smart energy distribution using IoT sensors' },
  { id: 'R003', groupName: 'NLP Innovators', faculty: 'Computer Science', year: 2023, rank: 1, members: 5, topic: 'Natural Language Processing', leader: 'Mike Johnson', description: 'Advanced NLP for multilingual translation' },
  { id: 'R004', groupName: 'Robo Warriors', faculty: 'Mechanical Engineering', year: 2024, rank: 3, members: 4, topic: 'Autonomous Navigation', leader: 'Sarah Williams', description: 'Self-driving robots for warehouse automation' },
  { id: 'R005', groupName: 'Cyber Defenders', faculty: 'Computer Science', year: 2023, rank: 2, members: 3, topic: 'Network Security', leader: 'David Lee', description: 'AI-based intrusion detection systems' },
  { id: 'R006', groupName: 'Power Innovators', faculty: 'Electrical Engineering', year: 2023, rank: 1, members: 4, topic: 'Renewable Energy', leader: 'Emily Davis', description: 'Optimizing solar panel efficiency' },
  { id: 'R007', groupName: 'Data Miners', faculty: 'Computer Science', year: 2024, rank: 4, members: 5, topic: 'Big Data Analytics', leader: 'Tom Brown', description: 'Real-time data processing frameworks' },
  { id: 'R008', groupName: 'Thermo Engineers', faculty: 'Mechanical Engineering', year: 2023, rank: 2, members: 3, topic: 'Heat Transfer', leader: 'Lisa Chen', description: 'Advanced cooling systems for electronics' },
];

export default function ResearchBoard() {
  const [research, setResearch] = useState<Research[]>(initialMockResearch);
  const [selectedResearch, setSelectedResearch] = useState<Research | null>(null);
  const [filterFaculty, setFilterFaculty] = useState('all');
  const [filterYear, setFilterYear] = useState('all');
  const [editData, setEditData] = useState<Research | null>(null);

  const faculties = ['all', 'Computer Science', 'Electrical Engineering', 'Mechanical Engineering'];
  const years = ['all', '2021', '2022', '2023', '2024'];

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
      const newMockResearch: Research[] = [
        { id: 'R009', groupName: 'Quantum Computing', faculty: 'Computer Science', year: 2024, rank: 1, members: 4, topic: 'Quantum Algorithms', leader: 'Alex Taylor', description: 'Exploring quantum computing applications' },
        { id: 'R010', groupName: 'Green Energy', faculty: 'Electrical Engineering', year: 2024, rank: 3, members: 5, topic: 'Sustainable Power', leader: 'Maria Garcia', description: 'Renewable energy storage solutions' },
      ];
      
      setResearch([...research, ...newMockResearch]);
      alert(`File "${file.name}" uploaded! Added ${newMockResearch.length} new research groups.`);
      e.target.value = '';
    }
  };

  const handleSave = () => {
    if (editData) {
      setResearch(research.map(r => r.id === editData.id ? editData : r));
      setSelectedResearch(null);
      setEditData(null);
      alert('Research group updated successfully!');
    }
  };

  const handleDelete = () => {
    if (selectedResearch && confirm(`Delete ${selectedResearch.groupName}?`)) {
      setResearch(research.filter(r => r.id !== selectedResearch.id));
      setSelectedResearch(null);
      setEditData(null);
      alert('Research group deleted successfully!');
    }
  };

  const openModal = (researchItem: Research) => {
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
                    {researchItem.id}
                  </div>
                  <h3 style={{ 
                    fontSize: '1.25rem', 
                    fontWeight: '700', 
                    color: '#1f2937', 
                    margin: 0,
                    marginBottom: '0.25rem'
                  }}>
                    {researchItem.groupName}
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
                  Edit Research Group
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0.25rem 0 0 0' }}>
                  Update research group information
                </p>
              </div>
              <button 
                onClick={() => { setSelectedResearch(null); setEditData(null); }} 
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
                  {key === 'description' ? (
                    <textarea
                      value={value as string}
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
                  ) : key === 'faculty' ? (
                    <select
                      value={value as string}
                      onChange={(e) => setEditData({...editData, [key]: e.target.value})}
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
                  ) : (
                    <input
                      type={key === 'year' || key === 'rank' || key === 'members' ? 'number' : 'text'}
                      value={value}
                      onChange={(e) => setEditData({...editData, [key]: (key === 'year' || key === 'rank' || key === 'members') ? parseInt(e.target.value) || 0 : e.target.value})}
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
    </>
  );
}