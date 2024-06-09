import React, { createContext, useState, useEffect, ReactNode } from 'react';

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
  const [authState, setAuthState] = useState<AuthState>(() => {
    const token = localStorage.getItem('accessToken');
    const user = localStorage.getItem('user');
    if (token && user) {
      return { token, user: JSON.parse(user), isAuthenticated: true };
    }
    return defaultAuthState;
  });

  useEffect(() => {
    if (authState.token && authState.user) {
      localStorage.setItem('accessToken', authState.token);
      localStorage.setItem('user', JSON.stringify(authState.user));
    } else {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    }
  }, [authState]);

  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
      {children}
    </AuthContext.Provider>
  );
};
