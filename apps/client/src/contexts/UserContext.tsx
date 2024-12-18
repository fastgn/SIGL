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
  const [storage, setStorage] = useState(localStorage);

  useEffect(() => {
    setStorage(localStorage.getItem("authToken") !== null ? localStorage : sessionStorage);
  }, []);
  const getIsAdmin = () => {
    return storage.getItem("isAdmin") === "true";
  };

  const getUserId = () => {
    return storage.getItem("id");
  };

  const [isAdmin, setIsAdmin] = useState(getIsAdmin() || false);
  const [id, setId] = useState(parseInt(getUserId() as string) || -1);

  if (isAdmin === null) {
    storage.removeItem("isAdmin");
  } else {
    storage.setItem("isAdmin", isAdmin.toString());
  }
  if (id === null) {
    storage.removeItem("id");
  } else {
    storage.setItem("id", id.toString());
  }

  useEffect(() => {
    const isAdmin = storage.getItem("isAdmin");
    if (isAdmin) {
      setIsAdmin(isAdmin === "true");
    }
    const id = storage.getItem("id");
    if (id) {
      setId(parseInt(id as string));
    }
  }, [storage]);

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
