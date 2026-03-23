"use client";
import React, { createContext, useState, useEffect, ReactNode } from "react";
import Cookies from "js-cookie";

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
    const savedToken = Cookies.get("token");
    const savedUser = Cookies.get("user");

    console.log("Cookies loaded:", savedToken, savedUser); // Debug cookies

    if (savedToken && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        console.log("Parsed user:", parsedUser); // Debug parsed user

        setToken(savedToken);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user cookie:", error);
        Cookies.remove("token");
        Cookies.remove("user");
      }
    }
  }, []);

  const login = (newToken: string, userData: User) => {
    Cookies.set("token", newToken, { expires: 7, secure: true, sameSite: "Strict" });
    Cookies.set("user", JSON.stringify(userData), { expires: 7, secure: true, sameSite: "Strict" });
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
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
