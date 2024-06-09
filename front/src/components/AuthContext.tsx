import React, { createContext, useState, ReactNode } from 'react';

interface AuthState {
  token: string;
  user: any;
  isAuthenticated: boolean;
}

const defaultAuthState: AuthState = {
  token: '',
  user: null,
  isAuthenticated: false,
};

export const AuthContext = createContext<{
  authState: AuthState;
  setAuthState: React.Dispatch<React.SetStateAction<AuthState>>;
}>({
  authState: defaultAuthState,
  setAuthState: () => {}
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(defaultAuthState);

  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
      {children}
    </AuthContext.Provider>
  );
};