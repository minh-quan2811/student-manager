import { useAuth } from '../../../auth/AuthContext';

export default function StudentDashboard() {
  const { user, logout } = useAuth();

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f3f4f6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '20px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        padding: '3rem',
        textAlign: 'center',
        maxWidth: '500px'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          margin: '0 auto 1.5rem',
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2rem',
          color: 'white',
          fontWeight: 'bold'
        }}>
          S
        </div>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          color: '#1a1a2e',
          marginBottom: '0.5rem'
        }}>
          You're in Student
        </h1>
        <p style={{
          color: '#6b7280',
          fontSize: '1.1rem',
          marginBottom: '2rem'
        }}>
          Welcome, {user?.name}!
        </p>
        <button
          onClick={logout}
          style={{
            padding: '0.75rem 2rem',
            fontSize: '1rem',
            fontWeight: '600',
            color: 'white',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            transition: 'all 0.3s'
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}