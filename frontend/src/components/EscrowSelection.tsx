import { accounts } from "@/libs/accounts";
import { KINDS, RELAYS } from "@/libs/nostr";
import { eventStore } from "@/stores/eventStore";
import { createSignal, For, from, JSX, splitProps } from "solid-js";
import { ProfilePreview } from "./ProfilePreview";
import { FormStore, setValue } from "@modular-forms/solid";
import { combineLatest, map, of, tap } from "rxjs";

type escrowSelectionProps = {
  counterparty?: string;
  name: string;
  type?: "text" | "email" | "tel" | "password" | "url" | "date";
  label?: string;
  placeholder?: string;
  value: string | undefined;
  error?: string;
  required?: boolean;
  ref: (element: HTMLInputElement) => void;
  onInput: JSX.EventHandler<HTMLInputElement, InputEvent>;
  onChange: JSX.EventHandler<HTMLInputElement, Event>;
  onBlur: JSX.EventHandler<HTMLInputElement, FocusEvent>;
  form: FormStore<any, any>;
};

export default function EscrowSelection(props: escrowSelectionProps) {
  const [, inputProps] = splitProps(props, ["value", "label", "error", "form"]);

  const account = from(accounts.active$);

  const proposerFollows$ = eventStore
    .filters({
      authors: [account()!.pubkey],
      kinds: [KINDS.FOLLOWS],
    })
    .pipe(
      map((e) => e.tags.filter((t) => t[0] == "p" && t[1]).map((t) => t[1]))
    )
    .pipe(tap((e) => console.log("proposer", e.length)));

  const counterpartyFollows$ = props.counterparty
    ? eventStore
        .filters({
          authors: [props.counterparty],
          kinds: [KINDS.FOLLOWS],
        })
        .pipe(
          map((e) => e.tags.filter((t) => t[0] == "p" && t[1]).map((t) => t[1]))
        )
        .pipe(tap((e) => console.log("counterparty", e.length)))
    : of([]);

  const mutualFollows$ = combineLatest([proposerFollows$, counterpartyFollows$])
    .pipe(
      map(([p, c]) => {
        return p.filter((pubkey) => c.includes(pubkey));
      })
    )
    .pipe(tap((e) => console.log("mutual", e.length)));

  const proposerFollows = from(proposerFollows$);
  const mutualFollows = from(mutualFollows$);

  const [escrow, setEscrow] = createSignal<string | undefined>(props.value);

  function handleSelection(pubkey: string) {
    setEscrow(pubkey);
    setValue(props.form, props.name, pubkey);
  }

  return (
    <div class="overflow-auto">
      <label class="text-sm data-[disabled]:cursor-not-allowed data-[disabled]:opacity-70 font-medium data-[invalid]:text-destructive">
        Choose the Escrow
      </label>

      <div class="mt-2 max-h-80 overflow-auto">
        <ul>
          <For
            each={
              (mutualFollows() && mutualFollows()!.length > 0
                ? mutualFollows()
                : proposerFollows()
              )?.slice(-50) || []
            }
          >
            {(pubkey) => (
              <button
                type="button"
                onClick={() => handleSelection(pubkey)}
                class={`p-1 rounded w-full hover:bg-secondary ${
                  pubkey == escrow() ? " bg-accent" : ""
                }`}
              >
                <ProfilePreview pubkey={pubkey} />
              </button>
            )}
          </For>
        </ul>
      </div>
      <input type="hidden" {...inputProps} id={props.name} value={escrow()} />
    </div>
  );
}
