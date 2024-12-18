import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext, AuthContextType } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  component: React.ComponentType;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component, ...rest }) => {
  const authContext = useContext<AuthContextType | undefined>(AuthContext);

  if (!authContext) {
    return <Navigate to="/login" />;
  }

  const { getToken } = authContext;

  return getToken() ? <Component {...rest} /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
