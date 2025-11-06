import { createContext, useContext, Accessor } from "solid-js";
import { AuthMethod } from "@/libs/signIn";

export type AuthState = {
  method: AuthMethod | null;
  pubkey: string | null;
  nsec: string | null;
  isLoading: boolean;
};

export const defaultState: AuthState = {
  method: null,
  pubkey: null,
  nsec: null,
  isLoading: true,
};

// Context containing auth state and methods
export type AuthContextValue = {
  state: AuthState;
  signIn: (method: AuthMethod, nsec?: string, pubkey?: string) => Promise<void>;
  signOut: () => void;
  isAuthenticated: Accessor<boolean>;
  setOnSignInSuccess: (callback: () => void) => void;
  dialogIsOpen: Accessor<boolean>;
  setDialogIsOpen: (isOpen: boolean) => void;
};

export const AuthContext = createContext<AuthContextValue>({
  state: defaultState,
  signIn: async () => {},
  signOut: () => {},
  isAuthenticated: () => false,
  setOnSignInSuccess: () => {},
  dialogIsOpen: () => false,
  setDialogIsOpen: () => {},
});

// Hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
