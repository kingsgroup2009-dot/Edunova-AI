import { createContext } from "react";

export type AccountMode = "public" | "school";

export type AuthUser = {
  email: string;
  name: string;
  mode: AccountMode;
  rollNumber?: string;
};

export type AuthContextValue = {
  user: AuthUser | null;
  loginPublic: (email: string, password: string) => boolean;
  signupPublic: (name: string, email: string, password: string) => boolean;
  continueWithGoogle: () => void;
  signupSchool: (
    schoolEmail: string,
    schoolPassword: string,
    studentName: string,
    rollNumber: string
  ) => boolean;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
