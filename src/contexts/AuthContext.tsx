import { useEffect, useState, type ReactNode } from "react";
import { AuthContext } from "./auth-context";
import type { User } from "@/interfaces/user";
import { getMeRequest, signInRequest } from "@/services/auth";

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const me = await getMeRequest(token);
        setUser(me);
      } catch {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, []);

  async function signIn(data: { email: string; password: string }) {
    const res = await signInRequest(data);

    if (!res?.token) {
      throw new Error("failed to sign in");
    }

    const authenticatedUser = await getMeRequest(res.token);
    setUser(authenticatedUser);

    localStorage.setItem("token", res.token);

    return authenticatedUser;
  }

  function signOut() {
    localStorage.removeItem("token");
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, signIn, signOut, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}
