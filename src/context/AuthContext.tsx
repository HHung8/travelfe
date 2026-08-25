import * as SecureStore from "expo-secure-store";
import { createContext, useContext, useEffect, useState } from "react";
import { loginApi, registerApi } from "../services/api";
import { AuthData, AuthUser } from "../types/auth";

type AuthContextType = {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string, phone: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);
async function persistAuthData(data: AuthData) {  
    await SecureStore.setItemAsync("accessToken", data.accessToken); 
    await SecureStore.setItemAsync("refreshToken", data.refreshToken);
    await SecureStore.setItemAsync("user", JSON.stringify(data.user));
}

export function AuthProvider({children}:{children: React.ReactNode}) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    async function restoreSession() {
      try {
        const [token, refresh, userStr] = await Promise.all([
          SecureStore.getItemAsync("accessToken"),
          SecureStore.getItemAsync("refreshToken"),
          SecureStore.getItemAsync("user")
        ]);
        if(token && userStr) {
          setAccessToken(token);
          setRefreshToken(refresh);
          setUser(JSON.parse(userStr));
        }
      }finally {
        setLoading(false);
      }
    } 

    useEffect(() => {
      restoreSession();
    },[])

    async function login(email:string, password:string) {
      const res = await loginApi(email,password);
      if(!res.data) throw new Error("Không nhận được dữ liệu đăng nhập");
      await persistAuthData(res.data);
      setAccessToken(res.data.accessToken);
      setRefreshToken(res.data.refreshToken);
      setUser(res.data.user);
    }

    async function register(fullName:string, email:string, password:string, phone:string) {
      const res = await registerApi(fullName, email, password, phone);
      if(!res.data) throw new Error("Không nhập được dữ liệu đăng ký.");
      await persistAuthData(res.data);
      setAccessToken(res.data.accessToken);
      setRefreshToken(res.data.refreshToken);
      setUser(res.data.user);
    }

    async function logout() {
      await SecureStore.deleteItemAsync("accessToken");
      await SecureStore.deleteItemAsync("refreshToken");
      await SecureStore.deleteItemAsync("user");
      setAccessToken(null);
      setRefreshToken(null);
      setUser(null);
    } 

    return (
      <AuthContext.Provider 
        value={{user, accessToken, refreshToken, loading, login, register, logout}}
      >
        {children}
      </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext); 