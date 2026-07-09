"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type User = {
  id?: string;
  email?: string;
  display_name?: string;
  name?: string;
  plan: {
    name: string;
  };
  avatar?: string;
  initials?: string;
};

type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function buildInitials(displayName: string | undefined) {
  if (!displayName) return "";
  return displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load from localStorage immediately for instant display
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("user");
      }
    }

    if (!window.location.pathname.includes("/dashboard")) {
      setIsLoading(false);
      return;
    }

    // Fetch fresh data from /me to keep sidebar up-to-date
    fetch("/api/users/me")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((result) => {
        const data = result?.data;
        if (!data) return;
        const freshUser: User = {
          id: data.id,
          email: data.email,
          display_name: data.display_name,
          name: data.display_name,
          plan: data.plan?.name ?? (typeof data.plan === "string" ? data.plan : undefined),
          initials: buildInitials(data.display_name),
        };
        setUser(freshUser);
        localStorage.setItem("user", JSON.stringify(freshUser));
      })
      .catch(() => {
        // Not authenticated or network error — use localStorage value as-is
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleSetUser = (newUser: User | null) => {
    setUser(newUser);
    if (newUser) {
      localStorage.setItem("user", JSON.stringify(newUser));
    } else {
      localStorage.removeItem("user");
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser: handleSetUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
