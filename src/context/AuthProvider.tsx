import { useCallback, useMemo, useState, type ReactNode } from "react";
import {
  AuthContext,
  type AuthUser,
  type AccountMode,
} from "./auth-context";

const ACCOUNTS_KEY = "edunova_accounts";
const SESSION_KEY = "edunova_session";

type StoredAccount = {
  name: string;
  password: string;
  mode: AccountMode;
  rollNumber?: string;
};

function loadAccounts(): Record<string, StoredAccount> {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, StoredAccount>;
  } catch {
    return {};
  }
}

function saveAccounts(accounts: Record<string, StoredAccount>) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

function loadSession(): AuthUser | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

function saveSession(user: AuthUser | null) {
  if (!user) {
    localStorage.removeItem(SESSION_KEY);
    return;
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => loadSession());

  const persistUser = useCallback((next: AuthUser | null) => {
    setUser(next);
    saveSession(next);
  }, []);

  const signupPublic = useCallback(
    (name: string, email: string, password: string) => {
      const key = email.trim().toLowerCase();
      if (!key || !password.trim() || !name.trim()) return false;
      const accounts = loadAccounts();
      if (accounts[key]) return false;
      accounts[key] = {
        name: name.trim(),
        password,
        mode: "public",
      };
      saveAccounts(accounts);
      persistUser({ email: key, name: name.trim(), mode: "public" });
      return true;
    },
    [persistUser]
  );

  const loginPublic = useCallback(
    (email: string, password: string) => {
      const key = email.trim().toLowerCase();
      const accounts = loadAccounts();
      const row = accounts[key];
      if (!row || row.password !== password || row.mode !== "public") {
        return false;
      }
      persistUser({
        email: key,
        name: row.name,
        mode: "public",
      });
      return true;
    },
    [persistUser]
  );

  const continueWithGoogle = useCallback(() => {
    const key = `google_${Date.now()}@edunova.app`;
    const accounts = loadAccounts();
    accounts[key] = {
      name: "Google User",
      password: "__oauth__",
      mode: "public",
    };
    saveAccounts(accounts);
    persistUser({ email: key, name: "Google User", mode: "public" });
  }, [persistUser]);

  const signupSchool = useCallback(
    (
      schoolEmail: string,
      schoolPassword: string,
      studentName: string,
      rollNumber: string
    ) => {
      const key = schoolEmail.trim().toLowerCase();
      const roll = rollNumber.trim();
      if (!key || !schoolPassword.trim() || !studentName.trim() || !roll) {
        return false;
      }
      const accounts = loadAccounts();
      const existing = accounts[key];
      if (existing) {
        if (
          existing.mode !== "school" ||
          existing.password !== schoolPassword ||
          existing.rollNumber !== roll
        ) {
          return false;
        }
        persistUser({
          email: key,
          name: existing.name,
          mode: "school",
          rollNumber: existing.rollNumber,
        });
        return true;
      }
      accounts[key] = {
        name: studentName.trim(),
        password: schoolPassword,
        mode: "school",
        rollNumber: roll,
      };
      saveAccounts(accounts);
      persistUser({
        email: key,
        name: studentName.trim(),
        mode: "school",
        rollNumber: roll,
      });
      return true;
    },
    [persistUser]
  );

  const logout = useCallback(() => {
    persistUser(null);
  }, [persistUser]);

  const value = useMemo(
    () => ({
      user,
      loginPublic,
      signupPublic,
      continueWithGoogle,
      signupSchool,
      logout,
    }),
    [
      user,
      loginPublic,
      signupPublic,
      continueWithGoogle,
      signupSchool,
      logout,
    ]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}
