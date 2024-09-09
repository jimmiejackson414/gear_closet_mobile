import { ReactNode, createContext, useContext, useState } from 'react';

export type TScreenStates = 'email' | 'password' | 'create' | 'forgotPassword' | 'passwordRecovery' | 'passwordReset';

interface AuthScreenContextProps {
  errors: { [key: string]: { [key: string]: string } };
  screen: TScreenStates;
  storedEmail: string;
  submitting: boolean;
  setErrors: (errors: { [key: string]: { [key: string]: string } }) => void;
  setScreen: (screen: TScreenStates) => void;
  setStoredEmail: (email: string) => void;
  setSubmitting: (submitting: boolean) => void;
}

const AuthScreenContext = createContext<AuthScreenContextProps | undefined>(undefined);

export const AuthScreenProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [screen, setScreen] = useState<TScreenStates>('email');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: { [key: string]: string } }>({});
  const [storedEmail, setStoredEmail] = useState('');

  return (
    <AuthScreenContext.Provider value={{
      screen, setScreen, submitting, setSubmitting, errors, setErrors, storedEmail, setStoredEmail,
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