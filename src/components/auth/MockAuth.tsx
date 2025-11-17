'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  name: string;
  email: string;
  picture?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading from local storage or a session
    const storedUser = localStorage.getItem('mockUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUser(user);
      
      // Set headers for API requests
      if (typeof window !== 'undefined') {
        (window as any).__mockAuthUser = {
          id: 'mock|demo-user-123',
          email: user.email,
          name: user.name,
          picture: user.picture,
        };
      }
    }
    setIsLoading(false);
  }, []);

  const login = () => {
    const mockUser: User = {
      name: 'Demo User',
      email: 'demo@example.com',
      picture: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=DU'
    };
    setUser(mockUser);
    localStorage.setItem('mockUser', JSON.stringify(mockUser));
    
    // Set headers for API requests
    if (typeof window !== 'undefined') {
      // Store user info for fetch interceptor
      (window as any).__mockAuthUser = {
        id: 'mock|demo-user-123',
        email: mockUser.email,
        name: mockUser.name,
        picture: mockUser.picture,
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mockUser');
    
    // Clear headers for API requests
    if (typeof window !== 'undefined') {
      delete (window as any).__mockAuthUser;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useUser() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
