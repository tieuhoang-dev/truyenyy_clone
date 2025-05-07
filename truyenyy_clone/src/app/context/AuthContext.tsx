"use client";
import React, { createContext, useState, useEffect, ReactNode } from "react";
import Cookies from "js-cookie"; // Thêm js-cookie để thao tác với cookie

type User = {
  id: string;
  username: string;
  role: string;
  status: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Lấy token và user từ cookie khi ứng dụng khởi chạy
    const savedToken = Cookies.get("token");
    const savedUser = Cookies.get("user");

    if (savedToken && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setToken(savedToken);
        setUser(parsedUser);
      } catch {
        Cookies.remove("token");
        Cookies.remove("user");
      }
    }
  }, []);

  const login = (newToken: string, userData: User) => {
    // Lưu token và user vào cookie
    Cookies.set("token", newToken, { expires: 7, secure: true, sameSite: "Strict" }); // Cookie sẽ tồn tại 7 ngày, dùng secure và sameSite cho bảo mật
    Cookies.set("user", JSON.stringify(userData), { expires: 7, secure: true, sameSite: "Strict" });
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    // Xóa token và user từ cookie khi logout
    Cookies.remove("token");
    Cookies.remove("user");
    setToken(null);
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
