import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export type UserRole = 'Admin' | 'Manager' | 'Supply Chain Manager';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  company?: string;
  bio?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Set up auth state listener FIRST
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          if (!mounted) return;
          
          if (session?.user) {
            const userData: User = {
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
              role: (session.user.user_metadata?.role as UserRole) || 'Manager',
              avatar: session.user.user_metadata?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(session.user.email?.split('@')[0] || 'User')}&background=2563eb&color=ffffff`,
              phone: session.user.user_metadata?.phone,
              company: session.user.user_metadata?.company,
              bio: session.user.user_metadata?.bio
            };
            setUser(userData);
          } else {
            setUser(null);
          }
          setIsLoading(false);
        });

        // THEN get current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (mounted) {
          if (session?.user) {
            const userData: User = {
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
              role: (session.user.user_metadata?.role as UserRole) || 'Manager',
              avatar: session.user.user_metadata?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(session.user.email?.split('@')[0] || 'User')}&background=2563eb&color=ffffff`,
              phone: session.user.user_metadata?.phone,
              company: session.user.user_metadata?.company,
              bio: session.user.user_metadata?.bio
            };
            setUser(userData);
          }
          setIsLoading(false);
        }

        return () => {
          mounted = false;
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    const cleanup = initializeAuth();
    
    return () => {
      mounted = false;
      cleanup.then(cleanupFn => cleanupFn?.());
    };
  }, []);

  const login = async (email: string, password: string, role?: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setIsLoading(false);
        // Return specific error messages based on Supabase error codes
        if (error.message.includes('Invalid login credentials')) {
          return { success: false, error: 'Invalid email or password' };
        } else if (error.message.includes('Email not confirmed')) {
          return { success: false, error: 'Please verify your email address' };
        } else if (error.message.includes('Too many requests')) {
          return { success: false, error: 'Too many login attempts. Please try again later' };
        }
        return { success: false, error: error.message };
      }

      if (data.user) {
        // Update user metadata with role if provided
        if (role) {
          await supabase.auth.updateUser({
            data: { role }
          });
        }
        
        setIsLoading(false);
        return { success: true };
      }
      
      setIsLoading(false);
      return { success: false, error: 'Authentication failed' };
    } catch (err) {
      setIsLoading(false);
      return { success: false, error: 'Network error. Please try again' };
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      
      // Update Supabase user metadata
      await supabase.auth.updateUser({
        data: {
          name: updatedUser.name,
          phone: updatedUser.phone,
          company: updatedUser.company,
          bio: updatedUser.bio,
          role: updatedUser.role
        }
      });
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    updateProfile,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};