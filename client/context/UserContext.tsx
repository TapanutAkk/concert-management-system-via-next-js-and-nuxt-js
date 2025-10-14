'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserContextType {
  role: 'admin' | 'user';
  setRole: (newRole: 'admin' | 'user') => void;
}

const defaultContextValue: UserContextType = {
  role: 'admin',
  setRole: () => {},
};

const UserContext = createContext<UserContextType>(defaultContextValue);

export function UserProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<'admin' | 'user'>('admin');

  return (
    <UserContext.Provider value={{ role, setRole }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);