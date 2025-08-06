
"use client";

import { createContext, useContext, useEffect, useState, type ReactNode} from 'react';
import { onAuthStateChanged, GoogleAuthProvider, signInWithRedirect, signOut, type User, signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword, createUserWithEmailAndPassword as firebaseCreateUserWithEmailAndPassword, updateProfile, getRedirectResult } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter, usePathname } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';


interface AuthContextType {
  user: User | null;
  loading: boolean;
  isGuest: boolean;
  setIsGuest: (isGuest: boolean) => void;
  signInWithGoogle: () => Promise<void>;
  signInWithEmailAndPassword: (email: string, password: string) => Promise<void>;
  signUpWithEmailAndPassword: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_ROUTES = ['/login', '/signup'];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  useEffect(() => {
    const guestStatus = typeof window !== 'undefined' && localStorage.getItem('isGuest') === 'true';
    setIsGuest(guestStatus);

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setIsGuest(false);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('isGuest');
        }
      }
      setLoading(false);
    });

    // Handle redirect result from Google SignIn
    getRedirectResult(auth)
      .catch((error) => {
        console.error("Error getting redirect result: ", error);
        toast({
          variant: "destructive",
          title: "Erro de Login",
          description: error.message || "Não foi possível completar o login com o Google.",
        });
      })
      .finally(() => {
        setLoading(false);
      });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (loading) return;

    const isAuthRoute = AUTH_ROUTES.includes(pathname);

    // If user is logged in or is a guest, and on an auth route, redirect to home
    if ((user || isGuest) && isAuthRoute) {
        router.replace('/');
        return;
    }
    
    // If no user and not a guest, and not on an auth route, redirect to login
    if (!user && !isGuest && !isAuthRoute) {
        router.replace('/login');
        return;
    }

  }, [user, isGuest, loading, pathname, router]);

  const handleSetIsGuest = (guest: boolean) => {
    setIsGuest(guest);
    if (guest) {
        localStorage.setItem('isGuest', 'true');
    } else {
        localStorage.removeItem('isGuest');
    }
  }

  const signInWithGoogle = async () => {
    if (loading) return; 

    const provider = new GoogleAuthProvider();
    try {
      setLoading(true);
      await signInWithRedirect(auth, provider);
      // The user is redirected, so the rest of the code will not execute until they return.
    } catch (error: any) {
      console.error("Error signing in with Google: ", error);
      toast({
        variant: "destructive",
        title: "Erro de Login",
        description: error.message || "Não foi possível iniciar o login com o Google.",
      });
      setLoading(false);
    }
  };

  const signInWithEmailAndPassword = async (email: string, password: string) => {
    if (loading) return;
    try {
      setLoading(true);
      await firebaseSignInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      console.error("Error signing in with email: ", error);
       toast({
        variant: "destructive",
        title: "Erro de Login",
        description: "Email ou senha inválidos.",
      });
    } finally {
        setLoading(false);
    }
  };

  const signUpWithEmailAndPassword = async (name: string, email: string, password: string) => {
    if (loading) return;
    try {
      setLoading(true);
      const userCredential = await firebaseCreateUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      // Manually update the user state after profile update
      setUser(auth.currentUser);
    } catch (error: any) {
      console.error("Error signing up with email: ", error);
      toast({
        variant: "destructive",
        title: "Erro no Cadastro",
        description: error.message || "Não foi possível criar a conta.",
      });
    } finally {
        setLoading(false);
    }
  }


  const logout = async () => {
    try {
      await signOut(auth);
      handleSetIsGuest(false);
      router.push('/login');
    } catch (error: any) {
      console.error("Error signing out: ", error);
      toast({
        variant: "destructive",
        title: "Erro de Logout",
        description: error.message || "Não foi possível fazer logout.",
      });
    }
  };
  
  const value = { user, loading, isGuest, setIsGuest: handleSetIsGuest, signInWithGoogle, signInWithEmailAndPassword, signUpWithEmailAndPassword, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
