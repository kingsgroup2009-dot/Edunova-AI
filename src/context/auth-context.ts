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
  loading: boolean;
  loginPublic: (email: string, password: string) => Promise<boolean>;
  signupPublic: (name: string, email: string, password: string) => Promise<boolean>;
  continueWithGoogle: () => Promise<void>;
  signupSchool: (
    schoolEmail: string,
    schoolPassword: string,
    studentName: string,
    rollNumber: string
  ) => Promise<boolean>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
