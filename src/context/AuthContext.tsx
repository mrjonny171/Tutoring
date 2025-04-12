import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';

// Define the shape of our profile data
export interface UserProfile {
  id: string;
  name: string | null;
  role: 'STUDENT' | 'TUTOR' | null;
  avatar_url: string | null;
  // Add other profile fields as needed
}

// Define the shape of our context data
interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Export the provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const supabase = createClient();
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("AuthContext: useEffect started."); // Log start

    // Function to fetch session and profile
    const fetchSessionAndProfile = async () => {
      console.log("AuthContext: fetchSessionAndProfile started.");
      setLoading(true); // Ensure loading is true at the start
      setError(null); // Assuming you might add an error state

      try {
        console.log("AuthContext: Fetching session...");
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
        console.log("AuthContext: Session data:", currentSession);
        if (sessionError) {
          console.error("AuthContext: Error fetching session:", sessionError);
          setSession(null);
          setUser(null);
          setProfile(null);
          // No return here, let finally handle loading state
          console.error("ERRORRRR");

        } else {
          console.log("AuthContext: Session fetched:", currentSession);
          setSession(currentSession);
          setUser(currentSession?.user ?? null);

          if (currentSession?.user) {
            console.log("AuthContext: User found in session, fetching profile for ID:", currentSession.user.id);
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', currentSession.user.id)
              .maybeSingle(); // Use maybeSingle() instead of single()

            if (profileError) {
              console.error("ERRORRRR");
              setProfile(null);

              if (profileError.code !== 'PGRST116') {
                  console.error("ERRORRRR");
              }
            } else {
              console.log("AuthContext: Profile fetched:", profileData);
              setProfile(profileData); // profileData will be null if no row found, which is fine
            }
          } else {
            console.log("AuthContext: No user in session, setting profile to null.");
            setProfile(null); // No user, no profile
          }
        }
      } catch (err: any) {
          console.error("AuthContext: Error in fetchSessionAndProfile try block:", err);
          // Reset states on catch
          setSession(null);
          setUser(null);
          setProfile(null);
      } finally {
        console.log("AuthContext: fetchSessionAndProfile finally block reached. Setting loading to false.");
        setLoading(false); // Set loading false regardless of success/error
      }
    };

    fetchSessionAndProfile();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        console.log("AuthContext: onAuthStateChange triggered. Event:", _event);
        console.log("AuthContext: New session:", newSession);
        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (newSession?.user) {
           console.log("AuthContext: User found in new session, fetching profile for ID:", newSession.user.id);
           try {
              // Fetch profile data again on auth change
              const { data: profileData, error: profileError } = await supabase
                 .from('profiles')
                 .select('*')
                 .eq('id', newSession.user.id)
                 .maybeSingle(); // Use maybeSingle() here too

              if (profileError) {
                console.error("AuthContext: Error fetching profile on auth change:", profileError);
                setProfile(null);
              } else {
                console.log("AuthContext: Profile fetched on auth change:", profileData);
                setProfile(profileData);
                console.log("AuthContext: Reached point AFTER profile fetch attempt in onAuthStateChange."); 
              }
           } catch (profileFetchError) {
              console.error("AuthContext: Uncaught error fetching profile on auth change:", profileFetchError);
              setProfile(null);
           }
        } else {
            console.log("AuthContext: No user in new session, setting profile to null.");
            setProfile(null);
        }
        // Explicitly set loading false AFTER state updates from auth change? Usually not needed.
        // console.log("AuthContext: onAuthStateChange finished, setting loading false."); 
        // setLoading(false); 
      }
    );

    // Cleanup listener on unmount
    return () => {
      console.log("AuthContext: Unsubscribing from auth changes.");
      // Access the subscription property inside data
      authListener?.data?.subscription?.unsubscribe();
    };
  }, [supabase]); // Dependency array includes supabase client

  const signOut = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
    }
    // State updates will be handled by onAuthStateChange listener
    // setLoading(false); // Listener will reset loading potentially
  };

  const value = {
    session,
    user,
    profile,
    loading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Export a hook to easily use the context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 