import type { User } from "@/interfaces/user";
import { createContext } from "react";

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  signIn: (data: { email: string; password: string }) => Promise<User>;
  signOut: () => void;
  isLoading: boolean;
};

export const AuthContext = createContext<AuthContextType | null>(null);
