
"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut, type User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isGuest: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_ROUTES = ['/login'];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) return;

    const isAuthRoute = AUTH_ROUTES.includes(pathname);

    if (user && isAuthRoute) {
      router.push('/');
    } else if (!user) {
      setIsGuest(true);
      if (!isAuthRoute) {
          router.push('/login');
      }
    } else {
        setIsGuest(false);
    }
  }, [user, loading, pathname, router]);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      setLoading(true);
      await signInWithPopup(auth, provider);
      // onAuthStateChanged will handle the user state update and redirect
    } catch (error) {
      console.error("Error signing in with Google: ", error);
      // Let the user know something went wrong.
      // You might want to use a toast notification here.
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      // onAuthStateChanged will set user to null, triggering the effect to redirect to login
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };
  
  const value = { user, loading, isGuest, signInWithGoogle, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
