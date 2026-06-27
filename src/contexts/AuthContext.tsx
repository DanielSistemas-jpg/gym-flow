import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { profiles as mockProfiles } from "@/lib/mock-data";
import type { Profile } from "@/lib/types";

interface AuthState {
  profile: Profile | null;
  loading: boolean;
  demoMode: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, nombre: string) => Promise<{ error?: string }>;
  signInWithGoogle: () => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);
const STORAGE_KEY = "ge_demo_profile";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setProfile(JSON.parse(saved));
      setLoading(false);
      return;
    }
    // With real Supabase: hydrate session then load profile row.
    supabase!.auth.getSession().then(async ({ data }) => {
      if (data.session?.user) {
        await loadProfile(data.session.user.id, data.session.user.email ?? "");
      }
      setLoading(false);
    });
    const { data: sub } = supabase!.auth.onAuthStateChange(async (_e, session) => {
      if (session?.user) await loadProfile(session.user.id, session.user.email ?? "");
      else setProfile(null);
    });
    return () => sub.subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadProfile(id: string, email: string) {
    const { data } = await supabase!.from("perfiles").select("*").eq("id", id).single();
    if (data) setProfile(data as Profile);
    else setProfile({ id, email, nombre: email, dni: "", telefono: "", role: "user", pin: "" });
  }

  function demoLogin(email: string): { error?: string } {
    const found = mockProfiles.find((p) => p.email.toLowerCase() === email.toLowerCase());
    const p = found ?? mockProfiles[1];
    setProfile(p);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
    return {};
  }

  const value = useMemo<AuthState>(
    () => ({
      profile,
      loading,
      demoMode: !isSupabaseConfigured,
      async signIn(email, password) {
        if (!isSupabaseConfigured) return demoLogin(email);
        const { error } = await supabase!.auth.signInWithPassword({ email, password });
        return error ? { error: error.message } : {};
      },
      async signUp(email, password, nombre) {
        if (!isSupabaseConfigured) return demoLogin(email);
        const { error } = await supabase!.auth.signUp({
          email,
          password,
          options: { data: { nombre }, emailRedirectTo: window.location.origin },
        });
        return error ? { error: error.message } : {};
      },
      async signInWithGoogle() {
        if (!isSupabaseConfigured) return demoLogin("admin@evolution.com");
        const { error } = await supabase!.auth.signInWithOAuth({
          provider: "google",
          options: { redirectTo: window.location.origin },
        });
        return error ? { error: error.message } : {};
      },
      async signOut() {
        if (isSupabaseConfigured) await supabase!.auth.signOut();
        localStorage.removeItem(STORAGE_KEY);
        setProfile(null);
      },
    }),
    [profile, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
