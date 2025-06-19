import React, { createContext, useContext, useState, useEffect } from 'react';

interface UserProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string;
}

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ data: any; error: any }>;
  signup: (email: string, password: string, fullName: string) => Promise<{ data: any; error: any }>;
  logout: () => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Mock auth initialization - replace with actual auth implementation
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Mock login - replace with actual implementation
    setUser({ id: '1', email });
    return { data: null, error: null };
  };

  const signup = async (email: string, password: string, fullName: string) => {
    // Mock signup - replace with actual implementation
    return { data: null, error: null };
  };

  const logout = async () => {
    // Mock logout - replace with actual implementation
    setUser(null);
    return { error: null };
  };

  const isAuthenticated = !!user;
  const isAdmin = false; // TODO: Implement admin check

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      isAuthenticated,
      isAdmin,
      loading,
      login,
      signup,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};