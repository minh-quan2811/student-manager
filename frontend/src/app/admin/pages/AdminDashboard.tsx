import { useState } from 'react';
import { useAuth } from '../../../auth/AuthContext';
import StudentBoard from '../components/StudentBoard';
import ProfessorBoard from '../components/ProfessorBoard';
import ResearchBoard from '../components/ResearchBoard';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState<'students' | 'professors' | 'research'>('students');

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f3f4f6'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '1.5rem 2rem',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '50px',
              height: '50px',
              background: 'white',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#667eea'
            }}>
              A
            </div>
            <div>
              <h1 style={{
                fontSize: '1.75rem',
                fontWeight: 'bold',
                color: 'white',
                margin: 0
              }}>
                Admin Dashboard
              </h1>
              <p style={{
                color: 'rgba(255,255,255,0.9)',
                fontSize: '0.875rem',
                margin: 0
              }}>
                Welcome, {user?.name}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            style={{
              padding: '0.625rem 1.5rem',
              fontSize: '0.9375rem',
              fontWeight: '600',
              color: '#667eea',
              backgroundColor: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'all 0.3s',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          gap: '0.5rem',
          padding: '0 2rem'
        }}>
          <button
            onClick={() => setActiveSection('students')}
            style={{
              padding: '1rem 2rem',
              fontSize: '1rem',
              fontWeight: '600',
              color: activeSection === 'students' ? '#667eea' : '#6b7280',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: activeSection === 'students' ? '3px solid #667eea' : '3px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Students
          </button>
          <button
            onClick={() => setActiveSection('professors')}
            style={{
              padding: '1rem 2rem',
              fontSize: '1rem',
              fontWeight: '600',
              color: activeSection === 'professors' ? '#667eea' : '#6b7280',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: activeSection === 'professors' ? '3px solid #667eea' : '3px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Professors
          </button>
          <button
            onClick={() => setActiveSection('research')}
            style={{
              padding: '1rem 2rem',
              fontSize: '1rem',
              fontWeight: '600',
              color: activeSection === 'research' ? '#667eea' : '#6b7280',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: activeSection === 'research' ? '3px solid #667eea' : '3px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Research
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '2rem'
      }}>
        {activeSection === 'students' && <StudentBoard />}
        {activeSection === 'professors' && <ProfessorBoard />}
        {activeSection === 'research' && <ResearchBoard />}
      </div>
    </div>
  );
}