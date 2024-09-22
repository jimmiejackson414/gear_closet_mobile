import { createContext, useContext, useEffect, useState } from 'react';
import { AppState, Platform } from 'react-native';
import { SplashScreen, useRouter, useSegments } from 'expo-router';
import { GoogleSignin, isErrorWithCode } from '@react-native-google-signin/google-signin';
import { AccessToken, AuthenticationToken, GraphRequest, GraphRequestManager, LoginManager } from 'react-native-fbsdk-next';
// import * as AppleAuthentication from 'expo-apple-authentication';
// import { jwtDecode } from 'jwt-decode';
import { supabase } from '../lib/supabase';
import type { Provider, Session, User } from '@supabase/supabase-js';

SplashScreen.preventAutoHideAsync();

GoogleSignin.configure({
  scopes: ['https://www.googleapis.com/auth/userinfo.profile'],
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
});

type SupabaseContextProps = {
  user: User | null;
  session: Session | null;
  initialized?: boolean;
  checkForEmail: (email: string) => Promise<boolean>;
  sendPasswordReset: (email: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithPassword: (email: string, password: string) => Promise<void>;
  signInWithOAuth: (provider: Provider) => Promise<void>;
  signOut: () => Promise<void>;
  verifyResetCode: (email: string, code: string) => Promise<void>;
};

type SupabaseProviderProps = {
  children: React.ReactNode;
};

export const SupabaseContext = createContext<SupabaseContextProps>({
  user: null,
  session: null,
  checkForEmail: async () => false,
  sendPasswordReset: async () => {},
  signUp: async () => {},
  signInWithPassword: async () => {},
  signInWithOAuth: async () => {},
  signOut: async () => {},
  verifyResetCode: async () => {},
});

export const useSupabase = () => useContext(SupabaseContext);

export const SupabaseProvider = ({ children }: SupabaseProviderProps) => {
  const router = useRouter();
  const segments = useSegments();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);

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

  // helper function
  const checkForEmail = async (email: string) => {
    const { data, error } = await supabase.from('profiles')
      .select('email')
      .eq('email', email)
      .maybeSingle();

    if (error) throw error;
    return Boolean(data);
  };

  // signup function via email and password
  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    setIsNewUser(true);
  };

  // signin function via email and password
  const signInWithPassword = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    setIsNewUser(false);
  };

  // send password reset email
  const sendPasswordReset = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  };

  // verify reset code function
  const verifyResetCode = async (email: string, code: string) => {
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: 'recovery',
    });

    if (error) throw error;
  };

  // signin function via google oauth
  const signInWithGoogle = async () => {
    await GoogleSignin.hasPlayServices();
    const response = await GoogleSignin.signIn();

    if (response.type !== 'success' || !response.data) {
      throw new Error('Google sign in failed');
    }

    const { idToken, user } = response.data;

    if (!idToken) throw new Error('Google sign in failed');

    const newUser = await checkForEmail(user.email);
    setIsNewUser(newUser);

    const { error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: idToken,
    });

    if (error) throw error;
  };

  // helper function to fetch email from facebook
  const fetchEmailFromFacebook = async () => {
    return new Promise<string>((resolve, reject) => {
      const graphRequest = new GraphRequest(
        '/me',
        { parameters: { fields: { string: 'id,name,email' } } },
        (error, result) => {
          if (error || !result) {
            reject(error || new Error('No result from Facebook API'));
          } else {
            const email = result.email;
            if (typeof email === 'string') {
              resolve(email);
            } else {
              reject(new Error('Email is not a string'));
            }
          }
        },
      );
      new GraphRequestManager()
        .addRequest(graphRequest)
        .start();
    });
  };

  // signin function via facebook oauth
  // TODO: Supabase bug currently exists with facebook oauth in verifying access token
  const signInWithFacebook = async () => {
    const loginResult = await LoginManager.logInWithPermissions(['public_profile', 'email']);
  
    if (loginResult.isCancelled) {
      throw new Error('User cancelled the login process');
    }
  
    let accessToken;
    if (Platform.OS === 'ios') {
      const tokenResult = await AuthenticationToken.getAuthenticationTokenIOS();
      accessToken = tokenResult?.authenticationToken;
    } else {
      const tokenResult = await AccessToken.getCurrentAccessToken();
      accessToken = tokenResult?.accessToken;
    }
  
    if (!accessToken) {
      throw new Error('Failed to obtain access token');
    }

    // const decodedToken = jwtDecode(accessToken) as any;
    // console.log({ decodedToken });
  
    // Fetch user email from Facebook API using GraphRequest
    const email = await fetchEmailFromFacebook();
  
    if (!email) {
      throw new Error('Failed to obtain email from Facebook');
    }
  
    // Check if the email exists in the database
    const emailExists = await checkForEmail(email);
    setIsNewUser(!emailExists);
  
    // Sign in to Supabase with the Facebook access token
    const { error } = await supabase.auth.signInWithIdToken({
      provider: 'facebook',
      token: accessToken,
      access_token: accessToken,
    });
  
    if (error) throw error;
  };

  // reconfigure once purchase of apple developer account is complete
  // const signInWithApple = async () => {
  //   const credential = await AppleAuthentication.signInAsync({
  //     requestedScopes: [
  //       AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
  //       AppleAuthentication.AppleAuthenticationScope.EMAIL,
  //     ],
  //   });

  //   if (credential.identityToken) {
  //     const { error } = await supabase.auth.signInWithIdToken({
  //       provider: 'apple',
  //       token: credential.identityToken,
  //     });

  //     if (error) throw error;
  //   }
  // };

  // navigate to the appropriate oauth signin function
  const signInWithOAuth = async (provider: Provider) => {
    try {
      switch (provider) {
        case 'google':
          await signInWithGoogle();
          break;
        // case 'apple':
        //   await signInWithApple();
        //   break;
        case 'facebook':
          await signInWithFacebook();
          break;
        default:
          throw new Error('Unsupported provider');
      }
    } catch (err) {
      if (isErrorWithCode(err)) {
        throw new Error(err.message);
      }
    }
  };

  // signout function
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      // prevent automatic login if user is in the password recovery flow
      if (event === 'PASSWORD_RECOVERY') return;

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
      // if new user, redirect to onboarding
      if (isNewUser) {
        router.replace('/(protected)/onboarding');
      } else {
        // otherwise, redirect to home
        router.replace('/(protected)/(drawer)/home');
      }
    } else if (!session) {
      // if not authenticated, redirect to welcome
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
      sendPasswordReset,
      signUp,
      signInWithPassword,
      signInWithOAuth,
      signOut,
      verifyResetCode,
    }}>
      {children}
    </SupabaseContext.Provider>
  );
};