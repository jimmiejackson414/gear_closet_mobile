import { createContext, useContext, useEffect, useState } from 'react';
import { Linking } from 'react-native';
import { useRouter } from 'expo-router';
import type { ReactNode } from 'react';

export type TScreenStates = 'email' | 'password' | 'create' | 'forgotPassword' | 'passwordRecovery' | 'passwordReset';

interface AuthScreenContextProps {
  errors: { [key: string]: { [key: string]: string } };
  resetCode: string | undefined;
  screen: TScreenStates;
  storedEmail: string;
  submitting: boolean;
  setErrors: (_errors: { [key: string]: { [key: string]: string } }) => void;
  setResetCode: (_code: string | undefined) => void;
  setScreen: (_screen: TScreenStates) => void;
  setStoredEmail: (_email: string) => void;
  setSubmitting: (_submitting: boolean) => void;
}

const AuthScreenContext = createContext<AuthScreenContextProps | undefined>(undefined);

export const AuthScreenProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [screen, setScreen] = useState<TScreenStates>('email');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: { [key: string]: string } }>({});
  const [storedEmail, setStoredEmail] = useState('');
  const [resetCode, setResetCode] = useState<string | undefined>(undefined);

  const router = useRouter();

  useEffect(() => {
    const handleDeepLink = ({ url }: { url: string }) => {
      const urlParams = new URLSearchParams(url.split('?')[1]);
      const code = urlParams.get('code');
      const email = urlParams.get('email');

      if (code) {
        setStoredEmail(email || '');
        setResetCode(code);
        setScreen('passwordReset');
        router.replace('/(public)/modal');
      }
    };

    const subscription = Linking.addEventListener('url', handleDeepLink);

    return () => {
      subscription.remove();
    };
  }, [router, setScreen, setStoredEmail, setResetCode]);

  return (
    <AuthScreenContext.Provider value={{
      screen, setScreen, submitting, setSubmitting, errors, setErrors, storedEmail, setStoredEmail, resetCode, setResetCode,
    }}>
      {children}
    </AuthScreenContext.Provider>
  );
};

export const useAuthScreenContext = () => {
  const context = useContext(AuthScreenContext);
  if (!context) {
    throw new Error('useAuthScreenContext must be used within a AuthScreenProvider');
  }
  return context;
};