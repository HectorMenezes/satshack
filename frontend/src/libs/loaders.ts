import {
  createAddressLoader,
  createEventLoader,
  createTimelineLoader,
} from "applesauce-loaders/loaders";
import { KINDS, pool, RELAYS } from "./nostr";
import { eventStore } from "@/stores/eventStore";

export const addressLoader = createAddressLoader(pool, {
  eventStore,
  lookupRelays: RELAYS,
});

export const eventLoader = createEventLoader(pool, {
  eventStore,
  extraRelays: RELAYS,
});

export const betProposalsLoader = createTimelineLoader(
  pool,
  RELAYS,
  {
    kinds: [KINDS.BET_PROPOSAL, KINDS.BET_ACCEPTANCE],
    limit: 50,
  },
  { eventStore }
);
