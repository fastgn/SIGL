import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

export interface UserContextType {
  isAdmin: boolean | null;
  setIsAdmin: Dispatch<SetStateAction<boolean>>;
  id: number | null;
  setId: Dispatch<SetStateAction<number>>;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(sessionStorage.getItem("isAdmin") === "true" || false);
  const [id, setId] = useState(parseInt(sessionStorage.getItem("id") as string) || -1);

  if (isAdmin === null) {
    sessionStorage.removeItem("isAdmin");
  } else {
    sessionStorage.setItem("isAdmin", isAdmin.toString());
  }
  if (id === null) {
    sessionStorage.removeItem("id");
  } else {
    sessionStorage.setItem("id", id.toString());
  }

  useEffect(() => {
    const isAdmin = sessionStorage.getItem("isAdmin");
    if (isAdmin) {
      setIsAdmin(isAdmin === "true");
    }
    const id = sessionStorage.getItem("id");
    if (id) {
      setId(parseInt(id as string));
    }
  }, []);

  return (
    <UserContext.Provider value={{ isAdmin, setIsAdmin, id, setId }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};
