import { truncatedNpub } from "@/libs/utils";
import ProfilePicture from "./ProfilePicture";
import { createEffect, from, Match, Show, Switch } from "solid-js";
import { ProfileModel } from "applesauce-core/models";
import { eventStore } from "@/stores/eventStore";
import { KINDS, RELAYS } from "@/libs/nostr";
import { addressLoader } from "@/libs/loaders";

export function ProfilePreview(props: {
  pubkey: string;
  hideNip05?: boolean;
  right?: boolean;
}) {
  createEffect(async () => {
    addressLoader({
      pubkey: props.pubkey,
      kind: KINDS.PROFILE,
      relays: RELAYS,
    }).subscribe();
  });

  const profile = from(eventStore.model(ProfileModel, props.pubkey));

  return (
    <div class="flex flex-row items-center gap-2">
      <Switch>
        <Match when={!props.right}>
          <div class={`w-6 h-6 rounded-full overflow-hidden`}>
            <ProfilePicture profile={profile} pubkey={props.pubkey} />
          </div>
          <span class="truncate">
            {profile()?.display_name || profile()?.name || props.pubkey}
          </span>
          <Show when={!props.hideNip05}>
            <p class="text-gray-400 ml-2 text-sm truncate">
              {profile() && profile()?.nip05}
            </p>
          </Show>
        </Match>
        <Match when={props.right}>
          <Show when={!props.hideNip05}>
            <p class="text-gray-400 ml-2 text-sm truncate">
              {profile() && profile()?.nip05}
            </p>
          </Show>
          <span class="truncate">
            {profile()?.display_name || profile()?.name || props.pubkey}
          </span>
          <div class={`w-6 h-6 rounded-full overflow-hidden`}>
            <ProfilePicture profile={profile} pubkey={props.pubkey} />
          </div>
        </Match>
      </Switch>
    </div>
  );
}
