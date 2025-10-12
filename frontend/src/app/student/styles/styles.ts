// frontend/src/app/student/styles/styles.ts

export const colors = {
  primary: {
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    shadow: 'rgba(102, 126, 234, 0.3)',
    shadowHover: 'rgba(102, 126, 234, 0.4)',
  },
  secondary: {
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    shadow: 'rgba(245, 158, 11, 0.3)',
    shadowHover: 'rgba(245, 158, 11, 0.4)',
  },
  success: {
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    light: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
    shadow: 'rgba(16, 185, 129, 0.3)',
    shadowHover: 'rgba(16, 185, 129, 0.4)',
    text: '#166534',
    border: '#bbf7d0',
  },
  danger: {
    gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    light: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
    shadow: 'rgba(239, 68, 68, 0.3)',
    shadowHover: 'rgba(239, 68, 68, 0.4)',
    text: '#991b1b',
    border: '#fecaca',
  },
  warning: {
    gradient: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
    text: '#92400e',
    border: '#fde68a',
  },
  neutral: {
    white: '#ffffff',
    gray50: '#f9fafb',
    gray100: '#f3f4f6',
    gray200: '#e5e7eb',
    gray400: '#9ca3af',
    gray600: '#6b7280',
    gray900: '#1f2937',
  }
};

export const baseCard = {
  background: colors.neutral.white,
  borderRadius: '16px',
  padding: '1.5rem',
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease',
  border: `2px solid ${colors.neutral.gray200}`,
};

export const baseButton = {
  padding: '0.75rem 1.25rem',
  border: 'none',
  borderRadius: '12px',
  fontWeight: '600' as const,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  fontSize: '0.875rem',
  transition: 'all 0.3s ease',
};

export const primaryButton = {
  ...baseButton,
  background: colors.primary.gradient,
  color: colors.neutral.white,
  boxShadow: `0 4px 12px ${colors.primary.shadow}`,
};

export const secondaryButton = {
  ...baseButton,
  background: colors.secondary.gradient,
  color: colors.neutral.white,
  boxShadow: `0 4px 12px ${colors.secondary.shadow}`,
};

export const successButton = {
  ...baseButton,
  background: colors.success.gradient,
  color: colors.neutral.white,
  boxShadow: `0 4px 12px ${colors.success.shadow}`,
};

export const dangerButton = {
  ...baseButton,
  background: colors.danger.gradient,
  color: colors.neutral.white,
  boxShadow: `0 4px 12px ${colors.danger.shadow}`,
};

export const outlineButton = {
  ...baseButton,
  background: colors.neutral.white,
  color: colors.neutral.gray600,
  border: `2px solid ${colors.neutral.gray200}`,
  boxShadow: 'none',
};

export const baseInput = {
  flex: 1,
  padding: '0.875rem 1rem',
  border: `2px solid ${colors.neutral.gray200}`,
  borderRadius: '12px',
  fontSize: '0.875rem',
  outline: 'none',
  transition: 'all 0.3s ease',
};

export const badge = {
  padding: '0.375rem 0.875rem',
  borderRadius: '8px',
  fontSize: '0.75rem',
  fontWeight: '600' as const,
};

export const iconContainer = {
  width: '40px',
  height: '40px',
  borderRadius: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
};

export const hoverEffects = {
  card: {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
  },
  button: {
    transform: 'translateY(-2px)',
  }
};