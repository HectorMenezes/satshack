import { ActionHub } from "applesauce-actions";
import { EventStore } from "applesauce-core";
import { EventFactory } from "applesauce-factory";
import { ExtensionSigner } from "applesauce-signers";
import { NostrEvent } from "nostr-tools";
import { pool, RELAYS } from "@/libs/nostr";

// Your existing instances
const eventStore = new EventStore();
const signer = new ExtensionSigner();
const eventFactory = new EventFactory({ signer });

function publish(event: NostrEvent) {
  pool.publish(RELAYS, event);
}

export const actionHub = new ActionHub(eventStore, eventFactory, publish);
