// src/context/UserContext.tsx
import { createContext, useContext, useState, type ReactNode } from "react";

type User = {
  name: string;
  phone: string;
  avatar_url?: string;
  email?: string
  department_name?: string
  projects?: { project_id: number; project_name: string; description: number, status: string, project_role: string }[]
};

type UserContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
