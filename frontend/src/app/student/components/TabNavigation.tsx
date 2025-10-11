// frontend/src/app/student/components/TabNavigation.tsx
import { User, Users, GraduationCap } from 'lucide-react';

type TabType = 'students' | 'groups' | 'professors';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const tabs = [
    { id: 'students' as const, label: 'Students', icon: User },
    { id: 'groups' as const, label: 'Groups', icon: Users },
    { id: 'professors' as const, label: 'Professors', icon: GraduationCap }
  ];

  return (
    <div
      style={{
        display: 'flex',
        gap: '0.75rem',
        padding: '1.25rem 2rem',
        borderBottom: '2px solid #e5e7eb',
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
              border: isActive ? 'none' : '2px solid #e5e7eb',
              borderRadius: '12px',
              background: isActive
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                : 'white',
              color: isActive ? 'white' : '#6b7280',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.3s ease',
              boxShadow: isActive ? '0 4px 12px rgba(102, 126, 234, 0.3)' : 'none'
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = '#f3f4f6';
                e.currentTarget.style.borderColor = '#667eea';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.borderColor = '#e5e7eb';
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