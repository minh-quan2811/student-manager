// frontend/src/app/student/components/TabNavigation.tsx
import { User, Users, GraduationCap, Folder } from 'lucide-react';
import { colors } from '../styles/styles';

type TabType = 'students' | 'groups' | 'professors' | 'mygroups';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const tabs = [
    { id: 'students' as const, label: 'Students', icon: User },
    { id: 'groups' as const, label: 'Groups', icon: Users },
    { id: 'professors' as const, label: 'Professors', icon: GraduationCap },
    { id: 'mygroups' as const, label: 'My Groups', icon: Folder }
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
              background: isActive ? colors.primary.gradient : colors.neutral.white,
              color: isActive ? 'white' : colors.neutral.gray600,
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.3s ease',
              boxShadow: isActive ? `0 4px 12px ${colors.primary.shadow}` : 'none'
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = colors.neutral.gray100;
                e.currentTarget.style.borderColor = '#667eea';
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
          </button>
        );
      })}
    </div>
  );
}