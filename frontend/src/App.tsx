import { AuthProvider, useAuth } from './auth/AuthContext';
import Login from './auth/Login';
import AdminDashboard from './app/admin/pages/AdminDashboard';
import StudentDashboard from './app/student/pages/StudentDashboard';
import ProfessorDashboard from './app/professor/pages/ProfessorDashboard';

function AppContent() {
  const { user } = useAuth();

  if (!user) {
    return <Login />;
  }

  switch (user.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'student':
      return <StudentDashboard />;
    case 'professor':
      return <ProfessorDashboard />;
    default:
      return <Login />;
  }
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;