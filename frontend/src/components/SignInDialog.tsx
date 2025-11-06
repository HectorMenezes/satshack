import { createMemo, createSignal, onMount } from "solid-js";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Button } from "./ui/button";
import { TextField, TextFieldRoot } from "./ui/textfield";
import { nip19 } from "nostr-tools";
import { AuthMethod } from "@/libs/signIn";
import { waitForNip07 } from "@/libs/utils";
import { useAuth } from "@/contexts/authContext";

export default function SignInDialog() {
  const { signIn, dialogIsOpen, setDialogIsOpen } = useAuth();

  const [nsec, setNsec] = createSignal<string | null>(null);
  const [nip07Available, setNip07Available] = createSignal(false);

  const nsecIsValid = createMemo(() => {
    if (!nsec()) return false;

    try {
      const decoded = nip19.decode(nsec()!);
      return decoded.type === "nsec";
    } catch {
      return false;
    }
  });

  const handleSignIn = async (method: AuthMethod) => {
    await signIn(method, nsec() || undefined);
  };

  onMount(async () => {
    waitForNip07().then((available) => {
      setNip07Available(available);
    });
  });

  return (
    <Dialog open={dialogIsOpen()} onOpenChange={setDialogIsOpen}>
      <DialogContent class="max-w-sm">
        <DialogHeader>
          <DialogTitle class="text-center">Sign In</DialogTitle>
          <div class="flex flex-col gap-1 w-full pt-2">
            <Button
              onClick={() => handleSignIn("nip07")}
              disabled={!nip07Available()}
              class="w-full"
            >
              Sign In with Extension
            </Button>
            <div class="text-center text-xs py-2 text-primary/60">
              or using your private key
            </div>
            <div class="flex flex-row gap-2 w-full my-1">
              <TextFieldRoot class="w-full">
                <TextField
                  class="h-8"
                  placeholder="nsec1..."
                  onInput={(e) => setNsec((e.target as HTMLInputElement).value)}
                />
              </TextFieldRoot>
              <Button
                size="sm"
                class="h-8 min-w-16"
                onClick={() => handleSignIn("nsec")}
                disabled={!nsecIsValid()}
              >
                Sign In
              </Button>
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
