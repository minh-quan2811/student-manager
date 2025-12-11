import { useState } from 'react';
import { useAuth } from './AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    setError('');
    setIsLoading(true);

    try {
      const success = await login(email, password);
      
      if (!success) {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred during login');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          padding: '3rem',
          width: '100%',
          maxWidth: '440px'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 1.5rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              color: 'white',
              fontWeight: 'bold'
            }}>
              R
            </div>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#1a1a2e',
              margin: '0 0 0.5rem 0'
            }}>
              Research Platform
            </h1>
            <p style={{
              color: '#6b7280',
              fontSize: '0.95rem',
              margin: 0
            }}>
              Connect, Collaborate, Innovate
            </p>
          </div>

          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="you@research.edu"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  fontSize: '1rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '10px',
                  outline: 'none',
                  transition: 'all 0.2s',
                  boxSizing: 'border-box',
                  opacity: isLoading ? 0.6 : 1
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="••••••••"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  fontSize: '1rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '10px',
                  outline: 'none',
                  transition: 'all 0.2s',
                  boxSizing: 'border-box',
                  opacity: isLoading ? 0.6 : 1
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            {error && (
              <div style={{
                padding: '0.75rem',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                color: '#dc2626',
                fontSize: '0.875rem',
                marginBottom: '1.5rem'
              }}>
                {error}
              </div>
            )}

            <button
              onClick={handleLogin}
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '0.875rem',
                fontSize: '1rem',
                fontWeight: '600',
                color: 'white',
                background: isLoading 
                  ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '10px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.5)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
              }}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>

          <div style={{
            marginTop: '1.5rem',
            textAlign: 'center',
            fontSize: '0.875rem',
            color: '#6b7280'
          }}>
            <p style={{ margin: 0 }}>
              Need help? Contact{' '}
              <a href="mailto:support@research.edu" style={{
                color: '#667eea',
                textDecoration: 'none',
                fontWeight: '600'
              }}>
                support@research.edu
              </a>
            </p>
          </div>
        </div>
      </div>

      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        color: 'white'
      }}>
        <div style={{ maxWidth: '500px', textAlign: 'center' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            marginBottom: '1.5rem',
            lineHeight: '1.2'
          }}>
            Empowering Research Through Collaboration
          </h2>
          <p style={{
            fontSize: '1.125rem',
            lineHeight: '1.8',
            opacity: '0.95'
          }}>
            Join a vibrant community where students and professors connect to drive groundbreaking research and innovation.
          </p>
          <div style={{
            marginTop: '3rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '2rem'
          }}>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>500+</div>
              <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Students</div>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>120+</div>
              <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Professors</div>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>80+</div>
              <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Projects</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}