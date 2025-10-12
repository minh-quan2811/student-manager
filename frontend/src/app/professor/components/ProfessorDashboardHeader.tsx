// frontend/src/app/professor/components/ProfessorDashboardHeader.tsx
import { LogOut, GraduationCap } from 'lucide-react';
import ProfessorNotificationBell from './ProfessorNotificationBell';
import { colors } from '../../student/styles/styles';
import type { MentorshipRequest } from '../data/mockData';

interface ProfessorDashboardHeaderProps {
  professorName: string;
  onLogout: () => void;
  requests: MentorshipRequest[];
  onViewRequest: (requestId: number) => void;
}

export default function ProfessorDashboardHeader({ 
  professorName, 
  onLogout,
  requests,
  onViewRequest
}: ProfessorDashboardHeaderProps) {
  return (
    <div
      style={{
        background: colors.secondary.gradient,
        padding: '1.5rem 2rem',
        color: 'white',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '50px',
              height: '50px',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
          >
            <GraduationCap size={28} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>Professor Portal</h1>
            <p style={{ fontSize: '0.875rem', opacity: 0.9, margin: 0 }}>Mentorship & Research Management</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <ProfessorNotificationBell
            requests={requests}
            onViewRequest={onViewRequest}
          />
          <div
            style={{
              padding: '0.625rem 1.25rem',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '10px',
              fontSize: '0.875rem',
              fontWeight: '600',
              backdropFilter: 'blur(10px)'
            }}
          >
            {professorName}
          </div>
          <button
            onClick={onLogout}
            style={{
              padding: '0.625rem 1.25rem',
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '10px',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
            }}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}