import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface User {
  email: string;
  role: 'admin' | 'student' | 'professor';
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const mockUsers = {
    'admin@research.edu': { password: 'admin123', role: 'admin' as const, name: 'Admin User' },
    'student@research.edu': { password: 'student123', role: 'student' as const, name: 'Quan' },
    'professor@research.edu': { password: 'prof123', role: 'professor' as const, name: 'Dr. Thu' },
  };

  const login = (email: string, password: string): boolean => {
    const userData = mockUsers[email as keyof typeof mockUsers];
    
    if (userData && userData.password === password) {
      setUser({
        email,
        role: userData.role,
        name: userData.name
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}