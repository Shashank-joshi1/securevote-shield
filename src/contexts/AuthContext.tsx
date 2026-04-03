import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, initStore } from "@/lib/store";

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = sessionStorage.getItem("current_user");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    initStore();
  }, []);

  useEffect(() => {
    if (user) {
      sessionStorage.setItem("current_user", JSON.stringify(user));
    } else {
      sessionStorage.removeItem("current_user");
    }
  }, [user]);

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
