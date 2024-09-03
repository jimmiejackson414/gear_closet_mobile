import { createContext, useContext, useEffect, useState } from 'react';
import { GoogleSignin, isErrorWithCode, isSuccessResponse, statusCodes } from '@react-native-google-signin/google-signin';
import { Provider, Session, User } from '@supabase/supabase-js';
import { SplashScreen, useRouter, useSegments } from 'expo-router';
import { AppState } from 'react-native';
import { supabase } from '../lib/supabase';

SplashScreen.preventAutoHideAsync();

GoogleSignin.configure({
  scopes: ['https://www.googleapis.com/auth/userinfo.profile'],
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
});

type SupabaseContextProps = {
  user: User | null;
  session: Session | null;
  initialized?: boolean;
  checkForEmail: (email: string) => Promise<boolean>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithPassword: (email: string, password: string) => Promise<void>;
  signInWithOAuth: (provider: Provider) => Promise<void>;
  signOut: () => Promise<void>;
};

type SupabaseProviderProps = {
  children: React.ReactNode;
};

export const SupabaseContext = createContext<SupabaseContextProps>({
  user: null,
  session: null,
  checkForEmail: async () => false,
  signUp: async () => {},
  signInWithPassword: async () => {},
  signInWithOAuth: async () => {},
  signOut: async () => {},
});

export const useSupabase = () => useContext(SupabaseContext);

export const SupabaseProvider = ({ children }: SupabaseProviderProps) => {
  const router = useRouter();
  const segments = useSegments();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Tells Supabase Auth to continuously refresh the session automatically if
  // the app is in the foreground. When this is added, you will continue to receive
  // `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
  // if the user's session is terminated. This should only be registered once.
  AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      supabase.auth.startAutoRefresh();
    } else {
      supabase.auth.stopAutoRefresh();
    }
  });

  const checkForEmail = async (email: string) => {
    const {
      data, error,
    } = await supabase.from('profiles').select('email').eq('email', email).maybeSingle();
    if (error) {
      throw error;
    }

    return Boolean(data);
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email, password,
    });
    if (error) {
      throw error;
    }
  };

  const signInWithPassword = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email, password,
    });
    if (error) {
      throw error;
    }
  };

  const signInWithOAuth = async (provider: Provider) => {
    try {
      switch (provider) {
        case 'google':
          await GoogleSignin.hasPlayServices();
          const response = await GoogleSignin.signIn();
          if (!isSuccessResponse(response)) {
            throw new Error('Google sign in failed');
          }
          break;
        case 'apple':
          break;
        case 'facebook':
          break;
        default:
          throw new Error('Unsupported provider');
      }
    } catch (err) {
      if (isErrorWithCode(err)) {
        switch (err.code) {
          case statusCodes.IN_PROGRESS:
            console.log('In progress');
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            // Android only, play services not available or outdated
            break;
          default:
            console.error(err);
        }
      }
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
  };

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log({
        event, session,
      });
      setSession(session);
      setUser(session ? session.user : null);
      setInitialized(true);
    });
    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!initialized) return;

    const inProtectedGroup = segments[0] === '(protected)';

    if (session && !inProtectedGroup) {
      router.replace('/(protected)/home');
    } else if (!session) {
      router.replace('/(public)/welcome');
    }

    /* HACK: Something must be rendered when determining the initial auth state...
		instead of creating a loading screen, we use the SplashScreen and hide it after
		a small delay (500 ms)
		*/

    setTimeout(() => {
      SplashScreen.hideAsync();
    }, 500);

    // Note: Do not remove the eslint disable; this will cause an infinite loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialized, session]);

  return (
    <SupabaseContext.Provider value={{
      user,
      session,
      initialized,
      checkForEmail,
      signUp,
      signInWithPassword,
      signInWithOAuth,
      signOut,
    }}>
      {children}
    </SupabaseContext.Provider>
  );
};