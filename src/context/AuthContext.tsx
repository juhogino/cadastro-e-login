import { createContext, useState } from "react";
import { User } from "../types/User";
import { saveUser } from "../storage/authStorage";

interface AuthContextData {
  user: User | null;
  register: (userData: User) => Promise<void>;
  login: (user: User) => void;
  logout: () => void;
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: any) {
  const [user, setUser] = useState<User | null>(null);

  async function register(userData: User) {
    await saveUser(userData);
  }

  function login(userData: User) {
    setUser(userData);
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
