'use client';

import React, { createContext, useContext, useState } from 'react';
import { CURRENT_USER, User } from '@/lib/mockData';

type UserContextType = {
  user: User;
  updateUser: (updates: Partial<User>) => void;
  isAuthenticated: boolean;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(CURRENT_USER);
  const [isAuthenticated] = useState(true); // Mock: siempre autenticado

  const updateUser = (updates: Partial<User>) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };

  return (
    <UserContext.Provider value={{ user, updateUser, isAuthenticated }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser debe usarse dentro de UserProvider');
  }
  return context;
}
