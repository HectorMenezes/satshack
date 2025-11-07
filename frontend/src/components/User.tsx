import { createEffect, createMemo, createSignal, from } from "solid-js";
import { accounts } from "@/libs/accounts";
import { addressLoader } from "@/libs/loaders";
import { of, switchMap, tap } from "rxjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuItemLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { LucideLogOut } from "lucide-solid";
import { truncatedNpub } from "@/libs/utils";
import { useAuth } from "@/contexts/authContext";
import { ProfileModel } from "applesauce-core/models";
import ProfilePicture from "./ProfilePicture";
import { eventStore } from "@/stores/eventStore";
import { KINDS, RELAYS } from "@/libs/nostr";

export default function User() {
  const account = from(accounts.active$);
  const { signOut } = useAuth();

  // fetch the user's profile when they sign in
  createEffect(async () => {
    const active = account();

    if (active) {
      addressLoader({
        pubkey: active.pubkey,
        kind: KINDS.PROFILE,
        relays: RELAYS,
      }).subscribe();

      addressLoader({
        pubkey: active.pubkey,
        kind: KINDS.FOLLOWS,
        relays: RELAYS,
      }).subscribe();
    }
  });

  // subscribe to the active account, then subscribe to the users profile or undefined
  const profile = from(
    accounts.active$.pipe(
      switchMap((account) =>
        account
          ? eventStore.model(ProfileModel, { pubkey: account!.pubkey })
          : of(undefined)
      )
    )
  );

  const displayNpub = createMemo(() => truncatedNpub(account()!.pubkey));

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <div class="w-8 h-8 rounded-full overflow-hidden">
            <ProfilePicture profile={profile} pubkey={account()!.pubkey} />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <DropdownMenuItemLabel>
              {profile()?.display_name || (
                <span class="text-xs">{displayNpub()}</span>
              )}
            </DropdownMenuItemLabel>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={signOut}>
            <LucideLogOut class="w-4 h-4 text-gray-600 mr-2" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
