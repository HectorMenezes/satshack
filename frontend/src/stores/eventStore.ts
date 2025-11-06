import { EventStore } from "applesauce-core";
import { verifyEvent } from "nostr-tools";

export const eventStore = new EventStore();

eventStore.verifyEvent = verifyEvent;

window.es = eventStore;
