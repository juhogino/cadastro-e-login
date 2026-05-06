import { createContext, useEffect, useState } from "react";
import { User } from "../types/User";
import { getUser, saveUser, logout as logoutStorage } from "../storage/authStorage";

interface AuthContextData {
  user: User | null;
  loading: boolean;
  login: (user: User) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: any) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const storedUser = await getUser();
      setUser(storedUser);
      setLoading(false);
    }
    loadUser();
  }, []);

  async function login(userData: User) {
    await saveUser(userData);
    setUser(userData);
  }

  async function logout() {
    await logoutStorage();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}