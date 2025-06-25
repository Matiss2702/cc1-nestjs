"use client";

import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { User } from "@/types/user";

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const authContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
});

interface AuthProviderProps {
  children: React.ReactNode;
}

interface JwtPayload {
  sub: string;
  email: string;
  username: string;
  color?: string;
  exp: number;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        setUser({
          id: decoded.sub,
          email: decoded.email,
          username: decoded.username,
          color: decoded.color ?? "#FFFFFF",
        });
      } catch (error) {
        console.error("error", error);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  return (
    <authContext.Provider value={{ user, setUser }}>
      {children}
    </authContext.Provider>
  );
};
