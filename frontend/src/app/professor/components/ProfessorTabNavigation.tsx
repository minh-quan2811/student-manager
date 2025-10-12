// frontend/src/app/professor/components/ProfessorTabNavigation.tsx
import { Inbox, Users } from 'lucide-react';
import { colors } from '../../student/styles/styles';

type TabType = 'requests' | 'mygroups';

interface ProfessorTabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  requestCount: number;
}

export default function ProfessorTabNavigation({ activeTab, onTabChange, requestCount }: ProfessorTabNavigationProps) {
  const tabs = [
    { id: 'requests' as const, label: 'Mentorship Requests', icon: Inbox, count: requestCount },
    { id: 'mygroups' as const, label: 'My Mentored Groups', icon: Users }
  ];

  return (
    <div
      style={{
        display: 'flex',
        gap: '0.75rem',
        padding: '1.25rem 2rem',
        borderBottom: `2px solid ${colors.neutral.gray200}`,
        backgroundColor: 'white',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
      }}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{
              padding: '0.75rem 1.5rem',
              border: isActive ? 'none' : `2px solid ${colors.neutral.gray200}`,
              borderRadius: '12px',
              background: isActive ? colors.secondary.gradient : colors.neutral.white,
              color: isActive ? 'white' : colors.neutral.gray600,
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.3s ease',
              boxShadow: isActive ? `0 4px 12px ${colors.secondary.shadow}` : 'none',
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = colors.neutral.gray100;
                e.currentTarget.style.borderColor = '#f59e0b';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = colors.neutral.white;
                e.currentTarget.style.borderColor = colors.neutral.gray200;
              }
            }}
          >
            <Icon size={18} />
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span
                style={{
                  minWidth: '20px',
                  height: '20px',
                  padding: '0 6px',
                  background: isActive ? 'rgba(255,255,255,0.3)' : colors.danger.gradient,
                  borderRadius: '10px',
                  fontSize: '0.625rem',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  marginLeft: '0.25rem'
                }}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}