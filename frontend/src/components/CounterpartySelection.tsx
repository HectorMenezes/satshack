import { accounts } from "@/libs/accounts";
import { KINDS } from "@/libs/nostr";
import { eventStore } from "@/stores/eventStore";
import { For, from } from "solid-js";

export default function CounterpartySelection() {
  const account = from(accounts.active$);
  const follows = from(
    eventStore.filters({ authors: [account()!.pubkey], kinds: [KINDS.FOLLOWS] })
  );

  return (
    <div class="max-h-80 overflow-auto">
      <ul>
        <For each={follows()?.tags}>{(item) => <li>{item[1]}</li>}</For>
      </ul>
    </div>
  );
}
