import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { AuthContext, type AuthUser, type AccountMode } from "./auth-context";
import { supabase } from "../lib/supabaseClient";

function mapUser(user: User): AuthUser {
  const metadata = user.user_metadata as Record<string, unknown> | undefined;
  return {
    email: user.email ?? "",
    name: (metadata?.name as string) || user.email || "Learner",
    mode: (metadata?.mode as AccountMode) || "public",
    rollNumber: metadata?.rollNumber as string | undefined,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) {
        return;
      }

      if (session?.user) {
        setUser(mapUser(session.user));
      }

      setLoading(false);
    }

    loadSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!mounted) {
          return;
        }

        if (session?.user) {
          setUser(mapUser(session.user));
        } else {
          setUser(null);
        }

        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signupPublic = useCallback(
    async (name: string, email: string, password: string) => {
      const normalizedEmail = email.trim().toLowerCase();
      if (!normalizedEmail || !password.trim() || !name.trim()) {
        return false;
      }

      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          data: {
            name: name.trim(),
            mode: "public",
          },
        },
      });

      if (error) {
        return false;
      }

      if (data.user) {
        setUser(mapUser(data.user));
        return true;
      }

      return false;
    },
    []
  );

  const loginPublic = useCallback(async (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !password.trim()) {
      return false;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    if (error || !data.session?.user) {
      return false;
    }

    setUser(mapUser(data.session.user));
    return true;
  }, []);

  const continueWithGoogle = useCallback(async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
  }, []);

  const signupSchool = useCallback(
    async (
      schoolEmail: string,
      schoolPassword: string,
      studentName: string,
      rollNumber: string
    ) => {
      const normalizedEmail = schoolEmail.trim().toLowerCase();
      const normalizedRoll = rollNumber.trim();

      if (
        !normalizedEmail ||
        !schoolPassword.trim() ||
        !studentName.trim() ||
        !normalizedRoll
      ) {
        return false;
      }

      const loginResult = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password: schoolPassword,
      });

      if (loginResult.data.user) {
        const metadata = loginResult.data.user.user_metadata as Record<string, unknown>;
        if (
          metadata?.mode !== "school" ||
          metadata?.rollNumber !== normalizedRoll
        ) {
          return false;
        }

        setUser(mapUser(loginResult.data.user));
        return true;
      }

      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password: schoolPassword,
        options: {
          data: {
            name: studentName.trim(),
            mode: "school",
            rollNumber: normalizedRoll,
          },
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        return false;
      }

      if (data.user) {
        setUser(mapUser(data.user));
      }

      return true;
    },
    []
  );

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      loginPublic,
      signupPublic,
      continueWithGoogle,
      signupSchool,
      logout,
    }),
    [
      user,
      loading,
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
