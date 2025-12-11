import { useState } from 'react';
import { X, User, GraduationCap, Plus, Trash2, Mail, Key } from 'lucide-react';

interface CreateAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  accountType: 'student' | 'professor';
  onSubmit: (accountData: any) => Promise<void>;
}

const faculties = ['FAST', 'Computer Science', 'Electrical Engineering', 'Mechanical Engineering'];
const years = ['2020', '2021', '2022', '2023', '2024'];

export default function CreateAccountModal({ isOpen, onClose, accountType, onSubmit }: CreateAccountModalProps) {
  const [formData, setFormData] = useState<any>({
    name: '',
    faculty: faculties[0],
    // Student fields
    student_id: '',
    gpa: 3.0,
    major: '',
    year: years[0],
    skills: [],
    // Professor fields
    professor_id: '',
    field: '',
    department: '',
    research_areas: [],
    publications: 0,
    total_slots: 5
  });

  const [currentSkill, setCurrentSkill] = useState('');
  const [currentResearchArea, setCurrentResearchArea] = useState('');
  const [generatedCreds, setGeneratedCreds] = useState<{username: string, password: string} | null>(null);

  if (!isOpen) return null;

  const generateCredentials = () => {
    if (accountType === 'student' && formData.student_id) {
      return {
        username: `${formData.student_id.toLowerCase()}@research.edu`,
        password: formData.student_id.toLowerCase()
      };
    } else if (accountType === 'professor' && formData.professor_id) {
      return {
        username: `${formData.professor_id.toLowerCase()}@research.edu`,
        password: formData.professor_id.toLowerCase()
      };
    }
    return { username: '', password: '' };
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.faculty) {
      alert('Please fill in required fields');
      return;
    }

    if (accountType === 'student' && (!formData.student_id || !formData.major)) {
      alert('Please fill in all required student fields');
      return;
    }

    if (accountType === 'professor' && (!formData.professor_id || !formData.field || !formData.department)) {
      alert('Please fill in all required professor fields');
      return;
    }

    try {
      const creds = generateCredentials();
      
      await onSubmit({
        ...formData,
        email: creds.username,
        password: creds.password,
        role: accountType
      });
      
      setGeneratedCreds(creds);
    } catch (error) {
      console.error('Failed to create account:', error);
      alert('Failed to create account. Please try again.');
    }
  };

  const handleAddSkill = () => {
    if (currentSkill.trim() && !formData.skills.includes(currentSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, currentSkill.trim()]
      });
      setCurrentSkill('');
    }
  };

  const handleAddResearchArea = () => {
    if (currentResearchArea.trim() && !formData.research_areas.includes(currentResearchArea.trim())) {
      setFormData({
        ...formData,
        research_areas: [...formData.research_areas, currentResearchArea.trim()]
      });
      setCurrentResearchArea('');
    }
  };

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
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        {/* Header */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '2px solid #e5e7eb',
          background: accountType === 'student' 
            ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
            : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderRadius: '20px 20px 0 0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {accountType === 'student' ? <User size={24} /> : <GraduationCap size={24} />}
            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>
              Create {accountType === 'student' ? 'Student' : 'Professor'} Account
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '8px',
              padding: '0.5rem',
              cursor: 'pointer',
              display: 'flex',
              color: 'white'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <div style={{ padding: '1.5rem' }}>
          {!generatedCreds ? (
            <>
              {/* Common Fields */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter full name"
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
                  value={formData.faculty}
                  onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '10px',
                    fontSize: '0.9375rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                    cursor: 'pointer'
                  }}
                >
                  {faculties.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>

              {/* Student-specific Fields */}
              {accountType === 'student' && (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                        Student ID *
                      </label>
                      <input
                        type="text"
                        value={formData.student_id}
                        onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                        placeholder="S001"
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
                        GPA *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="4.0"
                        value={formData.gpa}
                        onChange={(e) => setFormData({ ...formData, gpa: parseFloat(e.target.value) })}
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

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                        Major *
                      </label>
                      <input
                        type="text"
                        value={formData.major}
                        onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                        placeholder="Computer Science"
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
                        Year *
                      </label>
                      <select
                        value={formData.year}
                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem',
                          border: '2px solid #e5e7eb',
                          borderRadius: '10px',
                          fontSize: '0.9375rem',
                          outline: 'none',
                          boxSizing: 'border-box',
                          cursor: 'pointer'
                        }}
                      >
                        {years.map(y => <option key={y} value={y}>{y}</option>)}
                      </select>
                    </div>
                  </div>

                  <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                      Skills
                    </label>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <input
                        type="text"
                        value={currentSkill}
                        onChange={(e) => setCurrentSkill(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                        placeholder="Add a skill"
                        style={{
                          flex: 1,
                          padding: '0.75rem 1rem',
                          border: '2px solid #e5e7eb',
                          borderRadius: '10px',
                          fontSize: '0.9375rem',
                          outline: 'none'
                        }}
                      />
                      <button
                        onClick={handleAddSkill}
                        style={{
                          padding: '0.75rem 1rem',
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                    {formData.skills.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {formData.skills.map((skill: string) => (
                          <span
                            key={skill}
                            style={{
                              padding: '0.375rem 0.75rem',
                              background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                              color: '#92400e',
                              borderRadius: '8px',
                              fontSize: '0.75rem',
                              fontWeight: '600',
                              border: '2px solid #fde68a',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem'
                            }}
                          >
                            {skill}
                            <button
                              onClick={() => setFormData({
                                ...formData,
                                skills: formData.skills.filter((s: string) => s !== skill)
                              })}
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: 0,
                                display: 'flex',
                                color: '#92400e'
                              }}
                            >
                              <Trash2 size={12} />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Professor-specific Fields */}
              {accountType === 'professor' && (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                        Professor ID *
                      </label>
                      <input
                        type="text"
                        value={formData.professor_id}
                        onChange={(e) => setFormData({ ...formData, professor_id: e.target.value })}
                        placeholder="P001"
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
                        Department *
                      </label>
                      <input
                        type="text"
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        placeholder="Computer Science"
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
                      Research Field *
                    </label>
                    <input
                      type="text"
                      value={formData.field}
                      onChange={(e) => setFormData({ ...formData, field: e.target.value })}
                      placeholder="Machine Learning"
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
                      Research Areas
                    </label>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <input
                        type="text"
                        value={currentResearchArea}
                        onChange={(e) => setCurrentResearchArea(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddResearchArea()}
                        placeholder="Add research area"
                        style={{
                          flex: 1,
                          padding: '0.75rem 1rem',
                          border: '2px solid #e5e7eb',
                          borderRadius: '10px',
                          fontSize: '0.9375rem',
                          outline: 'none'
                        }}
                      />
                      <button
                        onClick={handleAddResearchArea}
                        style={{
                          padding: '0.75rem 1rem',
                          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                    {formData.research_areas.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {formData.research_areas.map((area: string) => (
                          <span
                            key={area}
                            style={{
                              padding: '0.375rem 0.75rem',
                              background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                              color: '#92400e',
                              borderRadius: '8px',
                              fontSize: '0.75rem',
                              fontWeight: '600',
                              border: '2px solid #fde68a',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem'
                            }}
                          >
                            {area}
                            <button
                              onClick={() => setFormData({
                                ...formData,
                                research_areas: formData.research_areas.filter((a: string) => a !== area)
                              })}
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: 0,
                                display: 'flex',
                                color: '#92400e'
                              }}
                            >
                              <Trash2 size={12} />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                        Publications
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.publications}
                        onChange={(e) => setFormData({ ...formData, publications: parseInt(e.target.value) || 0 })}
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
                        Total Slots *
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={formData.total_slots}
                        onChange={(e) => setFormData({ ...formData, total_slots: parseInt(e.target.value) || 5 })}
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
                </>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '2rem' }}>
                <button
                  onClick={onClose}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    background: 'white',
                    color: '#6b7280',
                    border: '2px solid #e5e7eb',
                    borderRadius: '10px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    background: accountType === 'student'
                      ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                      : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
                  }}
                >
                  Create Account
                </button>
              </div>
            </>
          ) : (
            // Success View with Credentials
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{
                width: '80px',
                height: '80px',
                margin: '0 auto 1.5rem',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '2rem'
              }}>
                ✓
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
                Account Created Successfully!
              </h3>
              <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
                Save these credentials - they won't be shown again
              </p>

              <div style={{
                background: '#f9fafb',
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                padding: '1.5rem',
                marginBottom: '2rem',
                textAlign: 'left'
              }}>
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <Mail size={16} color="#6b7280" />
                    <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>
                      Username
                    </label>
                  </div>
                  <div style={{
                    padding: '0.75rem 1rem',
                    background: 'white',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '0.9375rem',
                    fontFamily: 'monospace',
                    color: '#1f2937'
                  }}>
                    {generatedCreds.username}
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <Key size={16} color="#6b7280" />
                    <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>
                      Password
                    </label>
                  </div>
                  <div style={{
                    padding: '0.75rem 1rem',
                    background: 'white',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '0.9375rem',
                    fontFamily: 'monospace',
                    color: '#1f2937'
                  }}>
                    {generatedCreds.password}
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setGeneratedCreds(null);
                  onClose();
                }}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}