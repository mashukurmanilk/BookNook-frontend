"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { authClient, signIn, signUp, signOut, useSession } from "@/lib/auth-client";
import { setAuthToken, getAuthToken } from "@/lib/api";
import { toast } from "sonner";

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string | null;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, image?: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: sessionData, isPending } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Sync token from server
  const fetchToken = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/token");
      if (res.ok) {
        const data = await res.json();
        if (data.token) {
          setAuthToken(data.token);
          setTokenState(data.token);
          if (data.user) {
            setUser({
              id: data.user.id,
              name: data.user.name || data.user.email.split("@")[0],
              email: data.user.email,
              image: data.user.image,
            });
          }
          return;
        }
      }
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    async function initAuth() {
      if (isPending) return;

      if (sessionData?.user) {
        setUser({
          id: sessionData.user.id,
          name: sessionData.user.name || sessionData.user.email.split("@")[0],
          email: sessionData.user.email,
          image: sessionData.user.image,
        });
        await fetchToken();
      } else {
        // Check if there is a local token or try session
        const localTok = getAuthToken();
        if (localTok) {
          await fetchToken();
        } else {
          setUser(null);
          setAuthToken(null);
          setTokenState(null);
        }
      }
      setIsLoading(false);
    }

    initAuth();
  }, [sessionData, isPending, fetchToken]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await signIn.email({
        email,
        password,
      });

      if (error) {
        toast.error(error.message || "Failed to log in. Please check credentials.");
        return false;
      }

      await fetchToken();
      toast.success("Welcome back! Logged in successfully.");
      return true;
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred during login.");
      return false;
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    image?: string
  ): Promise<boolean> => {
    try {
      const { data, error } = await signUp.email({
        name,
        email,
        password,
        image: image || "",
      });

      if (error) {
        toast.error(error.message || "Failed to register account.");
        return false;
      }

      toast.success("Account created successfully! Please log in.");
      return true;
    } catch (err: any) {
      toast.error(err.message || "Registration failed. Please try again.");
      return false;
    }
  };

  const loginWithGoogle = async () => {
    try {
      await signIn.social({
        provider: "google",
        callbackURL: window.location.origin,
      });
    } catch (err: any) {
      toast.error(err.message || "Google sign in failed.");
    }
  };

  const logout = async () => {
    try {
      await signOut();
      setAuthToken(null);
      setTokenState(null);
      setUser(null);
      toast.success("Logged out successfully.");
      router.push("/");
    } catch (err: any) {
      toast.error("Logout failed.");
    }
  };

  const refreshAuth = async () => {
    await fetchToken();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        loginWithGoogle,
        logout,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
