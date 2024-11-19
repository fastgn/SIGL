import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import api from "@/services/api.service";

export interface AuthContextType {
  token: string | null;
  setToken: (token: string | null, persist?: boolean) => void;
  getToken: () => string | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setTokenState] = useState<string | null>(null);

  const setToken = (token: string | null, persist: boolean = false) => {
    api.setToken(token);
    setTokenState(token);

    if (token) {
      if (persist) {
        localStorage.setItem("authToken", token);
      } else {
        sessionStorage.setItem("authToken", token);
      }
    } else {
      localStorage.removeItem("authToken");
      sessionStorage.removeItem("authToken");
    }
  };

  useEffect(() => {
    // Check for an existing token in either storage on load
    const existingToken = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    if (existingToken) {
      api.setToken(existingToken);
      setTokenState(existingToken);
    }
  }, []);

  const getToken = () => {
    return token;
  };

  return (
    <AuthContext.Provider value={{ token, setToken, getToken }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
