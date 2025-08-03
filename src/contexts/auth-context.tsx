
"use client";

import { createContext, useContext, useEffect, useState, type ReactNode} from 'react';
import { onAuthStateChanged, GoogleAuthProvider, signInWithRedirect, signOut, type User, signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword, createUserWithEmailAndPassword as firebaseCreateUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
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
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setIsGuest(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) return;

    const isAuthRoute = AUTH_ROUTES.includes(pathname);

    // If user is logged in, and on an auth route, redirect to home
    if (user && isAuthRoute) {
        router.push('/');
        return;
    }
    
    // If no user and not a guest, and not on an auth route, redirect to login
    if (!user && !isGuest && !isAuthRoute) {
        router.push('/login');
        return;
    }

  }, [user, isGuest, loading, pathname, router]);

  const signInWithGoogle = async () => {
    if (loading) return; 

    const provider = new GoogleAuthProvider();
    try {
      setLoading(true);
      await signInWithRedirect(auth, provider);
    } catch (error: any) {
      console.error("Error signing in with Google: ", error);
      toast({
        variant: "destructive",
        title: "Erro de Login",
        description: error.message || "Não foi possível fazer login com o Google.",
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
      setLoading(false);
    }
  }


  const logout = async () => {
    try {
      await signOut(auth);
      setIsGuest(false);
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
  
  const value = { user, loading, isGuest, setIsGuest, signInWithGoogle, signInWithEmailAndPassword, signUpWithEmailAndPassword, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
