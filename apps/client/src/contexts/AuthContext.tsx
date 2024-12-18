import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import api from "@/services/api.service";

export interface AuthContextType {
  token: string | null;
  setToken: (token: string | null, persist?: boolean) => void;
  getToken: () => string | null;
  clearToken: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setTokenState] = useState<string | null>(null);

  const setToken = (token: string | null, persist: boolean = false) => {
    api.setToken(token, persist);
    setTokenState(token);
  };

  const getToken = () => {
    return api.getToken();
  };

  useEffect(() => {
    // Check for an existing token in either storage on load
    const existingToken = getToken();
    if (existingToken) setToken(existingToken);
  }, []);

  const clearToken = () => {
    api.clearToken();
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, setToken, getToken, clearToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
