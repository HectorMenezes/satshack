import type { ProfileContent } from "applesauce-core/helpers";
import { type ClassValue, clsx } from "clsx";
import { nip19, type NostrEvent } from "nostr-tools";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(timestamp: number) {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function truncate(value: string, length: number = 15) {
  if (value.length <= length) {
    return value;
  }

  return value.slice(0, length - 5) + "..." + value.slice(-5);
}

export function truncatedNpub(pubkey: string) {
  const npub = pubkey.startsWith("npub1") ? pubkey : nip19.npubEncode(pubkey);
  return truncate(npub);
}

export function profileName(profileEvent: NostrEvent) {
  const profile = JSON.parse(profileEvent.content) as ProfileContent;

  return (
    profile?.display_name || profile.name || truncatedNpub(profileEvent.pubkey)
  );
}

export function waitForNip07(retries = 10, delay = 100): Promise<boolean> {
  return new Promise((resolve) => {
    let attempts = 0;
    const check = () => {
      if (window.nostr) {
        resolve(true);
      } else if (attempts < retries) {
        attempts++;
        setTimeout(check, delay);
      } else {
        resolve(false);
      }
    };
    check();
  });
}
