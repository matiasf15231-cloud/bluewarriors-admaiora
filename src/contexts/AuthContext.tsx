import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  role: string | null;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Centralized function to fetch user profile data
    const fetchUserAndProfile = async (currentSession: Session | null) => {
      setSession(currentSession);
      const currentUser = currentSession?.user ?? null;
      setUser(currentUser);
      setProfile(null); // Reset profile before fetching

      if (currentUser) {
        try {
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentUser.id)
            .single();
          
          if (error) {
            // This can happen if the profile is not yet created, which is not a critical failure.
            console.error("Could not fetch profile:", error.message);
          } else {
            setProfile(profileData);
          }
        } catch (e) {
          console.error("A critical error occurred while fetching the profile:", e);
        }
      }
    };

    // Handle initial session load
    supabase.auth.getSession().then(({ data: { session } }) => {
      fetchUserAndProfile(session).finally(() => {
        setLoading(false);
      });
    });

    // Listen for changes in authentication state
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      await fetchUserAndProfile(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    session,
    user,
    profile,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};