import { RelayPool } from "applesauce-relay";

export const pool = new RelayPool();

export const RELAYS = [
  "wss://relay.primal.net",
  "wss://relay.damus.io",
  "wss://nostr.wine",
  "wss://relay.nostr.band",
];

export const KINDS = {
  PROFILE: 0,
  FOLLOWS: 3,
  BET_PROPOSAL: 30348,
  BET_ACCEPTANCE: 30349,
};
