import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserProfile } from '../types';
import { getStoredUser, setStoredUser, loginGuestUser } from '../services/firebase';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  loginAsGuest: (name: string, email: string) => void;
  logout: () => void;
  openAuthModal: boolean;
  setOpenAuthModal: (open: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => getStoredUser() || {
    uid: 'guest_default',
    displayName: 'Alex Rivers',
    email: 'alex.student@edugenie.ai',
    isGuest: true
  });
  const [openAuthModal, setOpenAuthModal] = useState<boolean>(false);

  useEffect(() => {
    setStoredUser(user);
  }, [user]);

  const loginAsGuest = (name: string, email: string) => {
    const newUser = loginGuestUser(name, email);
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
    setStoredUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: Boolean(user),
      loginAsGuest,
      logout,
      openAuthModal,
      setOpenAuthModal
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
