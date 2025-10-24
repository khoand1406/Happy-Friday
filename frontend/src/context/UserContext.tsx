// src/context/UserContext.tsx
import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { ACCESS_TOKEN } from "../constraint/LocalStorage";

type DecodedToken = {
  sub: string;
  email?: string;
  name?: string;
  exp?: number;
};

type User = {
  id: string;
  name: string;
  phone: string;
  avatar_url?: string;
  email?: string
  department_name?: string
  projects?: { project_id: number; project_name: string; description: string, status: string, project_role: string }[]
};

type UserContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN);
   
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        
        if (decoded && (!decoded.exp || decoded.exp * 1000 > Date.now())) {
          setUser({
            id: decoded.sub,
            email: decoded.email,
            name: decoded.name ?? "",
            phone: ""
          });
        } else {
          localStorage.removeItem(ACCESS_TOKEN);
        }
      } catch (err) {
        console.error("Invalid token", err);
        localStorage.removeItem(ACCESS_TOKEN);
      }
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};
