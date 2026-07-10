import * as SecureStore from 'expo-secure-store';
import React, { createContext, useContext, useEffect, useState } from "react";

type User = {
    id: string;
    email: string;
}

type AuthContextType = {
    user: User | null;
    login: (token:string) => Promise<void>;
    logout: () => Promise<void>;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export function AuthProvider({children}: {children: React.ReactNode}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    restoreToken();
  }, []);

  async function restoreToken() {
    const token = await SecureStore.getItemAsync("token");

    if (token) {
      setUser({
        id: "1",
        email: "demo@gmail.com",
      });
    }
    setLoading(false);
  }

    async function login(token: string) {
    await SecureStore.setItemAsync("token", token);

    setUser({
      id: "1",
      email: "demo@gmail.com",
    });
  }

  async function logout() {
    await SecureStore.deleteItemAsync("token");
    setUser(null);
  }
  return React.createElement(
    AuthContext.Provider,
    { value: { user, login, logout, loading } },
    children
  );
}

export const useAuth = () => useContext(AuthContext);