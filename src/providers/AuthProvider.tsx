import { createContext, useContext, useState, type ReactNode } from "react";

interface AuthUser { id: string; name: string; email: string }
interface AuthValue {
  user: AuthUser | null;
  login: (u: AuthUser) => void;
  logout: () => void;
}

const Ctx = createContext<AuthValue>({ user: null, login: () => {}, logout: () => {} });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  return (
    <Ctx.Provider value={{ user, login: setUser, logout: () => setUser(null) }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => useContext(Ctx);