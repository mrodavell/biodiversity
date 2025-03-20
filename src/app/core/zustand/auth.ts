import { Session, User } from "@supabase/supabase-js";
import { create } from "zustand";

type AuthState = {
  user: User | null;
  session: Session | null;
};

type AuthActions = {
  setUser: (user: User) => void;
  clearUser: () => void;
  setSession: (session: Session) => void;
  clearSession: () => void;
};

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  user: null,
  session: null,
  setUser: (user: User) => set({ user }),
  clearUser: () => set({ user: null }),
  setSession: (session: Session) => set({ session }),
  clearSession: () => set({ session: null }),
}));
