import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export type Role = 'visitor' | 'member' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

interface AuthContextType {
  user: User | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          // Auto-elevate specific user to admin
          if (firebaseUser.email === 'kianoshsolheim@gmail.com') {
            await setDoc(doc(db, 'admins', firebaseUser.uid), { role: 'admin', email: firebaseUser.email });
          }

          // Check if admin
          const adminDoc = await getDoc(doc(db, 'admins', firebaseUser.uid));
          const role = adminDoc.exists() ? 'admin' : 'member';

          // Ensure user profile exists
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (!userDoc.exists()) {
            await setDoc(doc(db, 'users', firebaseUser.uid), {
              name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Unknown',
              email: firebaseUser.email || '',
              role: role,
              createdAt: serverTimestamp()
            });
          }

          setUser({
            id: firebaseUser.uid,
            name: userDoc.exists() ? userDoc.data().name : (firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Unknown'),
            email: firebaseUser.email || '',
            role: role
          });
        } catch (e) {
          console.error("Error setting up user profile", e);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
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
