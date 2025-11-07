import { createResource, createSignal, JSX } from "solid-js";
import { createStore } from "solid-js/store";
import { AuthMethod, signIn } from "@/libs/signIn";
import { accounts } from "@/libs/accounts";
import { NostrConnectSigner, SimpleSigner } from "applesauce-signers";
import { NostrConnectAccount } from "applesauce-accounts/accounts";
import { waitForNip07 } from "@/libs/utils";
import { map } from "rxjs";
import {
  AuthContext,
  AuthContextValue,
  defaultState,
} from "../contexts/authContext";
import { generateSecretKey, nip19 } from "nostr-tools";

export function AuthProvider(props: { children: JSX.Element }) {
  const [state, setState] = createStore(defaultState);
  const [dialogIsOpen, setDialogIsOpen] = createSignal(false);
  let signInSuccessCallback: (() => void) | undefined;

  function signInSuccess() {
    setDialogIsOpen(false);
    signInSuccessCallback?.();
  }

  // Derived state - true if user is authenticated
  const isAuthenticated = () => !!state.pubkey && !state.isLoading;

  const saveSession = (data: {
    method: AuthMethod;
    pubkey: string;
    nsec: string | null;
    remoteRelay?: string;
  }) => {
    setState({
      method: data.method,
      pubkey: data.pubkey,
      nsec: data.nsec,
      isLoading: false,
    });

    localStorage.setItem("auth", JSON.stringify({ ...data }));
  };

  const clearSession = () => {
    setState({
      method: null,
      pubkey: null,
      nsec: null,
      isLoading: false,
    });

    localStorage.removeItem("auth");
  };

  const handleSignIn = async (
    method: AuthMethod,
    nsec?: string,
    pubkey?: string
  ) => {
    if (accounts.active) return;

    setState({ isLoading: true });

    try {
      const result = await signIn(method, nsec, pubkey);

      if (result) {
        saveSession({
          method,
          pubkey: result.pubkey,
          nsec: method === "nsec" ? nsec || null : null,
        });

        signInSuccess();
      } else {
        setState({ isLoading: false });
      }
    } catch (error) {
      console.error("Sign in error:", error);
      setState({ isLoading: false });
    }
  };

  const handleSignOut = () => {
    if (!accounts.active) return;

    const account = accounts.active;
    accounts.removeAccount(account);
    accounts.clearActive();

    clearSession();
  };

  const initializeAuth = async () => {
    setState({ isLoading: true });

    const stored = localStorage.getItem("auth");
    if (!stored) {
      setState({ isLoading: false });
      return;
    }

    const storedData = JSON.parse(stored);
    if (!storedData.method) {
      setState({ isLoading: false });
      return;
    }

    if (storedData.method === "nip07") {
      const nostrAvailable = await waitForNip07();
      if (!nostrAvailable) {
        console.warn("NIP-07 extension not available");
        setState({ isLoading: false });
        return;
      }
    }

    try {
      await handleSignIn(
        storedData.method,
        storedData.nsec || undefined,
        storedData.pubkey || undefined
      );
    } catch (error) {
      console.error("Error restoring auth:", error);
      setState({ isLoading: false });
    }
  };

  createResource(() => initializeAuth());

  const authValue: AuthContextValue = {
    state,
    signIn: handleSignIn,
    signOut: handleSignOut,
    isAuthenticated,
    setOnSignInSuccess: (callback: () => void) => {
      signInSuccessCallback = callback;
    },
    dialogIsOpen,
    setDialogIsOpen,
  };

  return (
    <AuthContext.Provider value={authValue}>
      {props.children}
    </AuthContext.Provider>
  );
}
