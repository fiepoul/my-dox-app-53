// Context for authentication state management
import { auth } from '@/firebaseconfig/firebaseconfig';
import * as SplashScreen from 'expo-splash-screen';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';

type AuthContextType = {
  user: User | null;
  initializing: boolean;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  initializing: true,
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  // Auth-state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setInitializing(false); // Når auth er færdig
    });
    return unsubscribe;
  }, []);

  // Håndter splashscreen
  useEffect(() => {
    if (!initializing) {
      SplashScreen.hideAsync(); // skjules først når auth er klar
    }
  }, [initializing]);

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('[AUTH] Logout failed:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, initializing, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);