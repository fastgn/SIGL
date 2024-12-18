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
  updateIsAdminAndId: (isAdmin: boolean, id: number) => void;
  clear: () => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const getStorage = () => {
    const value = localStorage.getItem("authToken") !== null ? localStorage : sessionStorage;
    return value;
  };

  const getStorageOpposite = () => {
    return getStorage() === localStorage ? sessionStorage : localStorage;
  };

  const getIsAdmin = () => {
    return getStorage().getItem("isAdmin") === "true";
  };

  const getUserId = () => {
    return getStorage().getItem("id");
  };

  const [isAdmin, setIsAdmin] = useState(getIsAdmin());
  const [id, setId] = useState(parseInt(getUserId() as string));

  const updateIsAdminAndId = (isAdmin: boolean, id: number) => {
    setIsAdmin(isAdmin);
    setId(id);
    getStorage().setItem("isAdmin", isAdmin.toString());
    getStorage().setItem("id", id.toString());
    getStorageOpposite().removeItem("isAdmin");
    getStorageOpposite().removeItem("id");
  };

  useEffect(() => {
    const isAdmin = getStorage().getItem("isAdmin");
    if (isAdmin) {
      setIsAdmin(isAdmin === "true");
    }
    const id = getStorage().getItem("id");
    if (id) {
      setId(parseInt(id as string));
    }
  }, []);

  const clear = () => {
    getStorage().removeItem("isAdmin");
    getStorage().removeItem("id");
  };

  return (
    <UserContext.Provider value={{ isAdmin, setIsAdmin, id, setId, updateIsAdminAndId, clear }}>
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
