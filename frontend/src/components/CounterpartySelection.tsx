import { accounts } from "@/libs/accounts";
import { KINDS, RELAYS } from "@/libs/nostr";
import { eventStore } from "@/stores/eventStore";
import { createSignal, For, from, JSX, splitProps } from "solid-js";
import { ProfilePreview } from "./ProfilePreview";
import { FormStore, setValue } from "@modular-forms/solid";
import { addressLoader } from "@/libs/loaders";

type counterpartySelectionProps = {
  name: string;
  type?: "text" | "email" | "tel" | "password" | "url" | "date";
  label?: string;
  placeholder?: string;
  value: string | undefined;
  error?: string;
  required?: boolean;
  ref: (element: HTMLInputElement) => void;
  onInput: JSX.EventHandler<HTMLInputElement, InputEvent>;
  onChange: any;
  onBlur: JSX.EventHandler<HTMLInputElement, FocusEvent>;
  form: FormStore<any, any>;
};

export default function CounterpartySelection(
  props: counterpartySelectionProps
) {
  const [, inputProps] = splitProps(props, ["value", "label", "error", "form"]);

  const account = from(accounts.active$);
  const follows = from(
    eventStore.filters({ authors: [account()!.pubkey], kinds: [KINDS.FOLLOWS] })
  );

  const [counterparty, setCounterparty] = createSignal<string | undefined>(
    props.value
  );

  function handleSelection(pubkey: string) {
    setCounterparty(pubkey);
    setValue(props.form, props.name, pubkey);

    addressLoader({
      pubkey,
      kind: KINDS.FOLLOWS,
      relays: RELAYS,
    });

    props.onChange(pubkey);
  }

  return (
    <div class="overflow-auto">
      <label class="text-sm data-[disabled]:cursor-not-allowed data-[disabled]:opacity-70 font-medium data-[invalid]:text-destructive">
        Choose the Counterparty
      </label>

      <div class="mt-2 max-h-80 overflow-auto">
        <ul>
          <For
            each={follows()
              ?.tags.slice(-50)
              .filter((t) => t[0] == "p" && t[1])
              .map((t) => t[1])
              .reverse()}
          >
            {(pubkey) => (
              <button
                onClick={() => handleSelection(pubkey)}
                class={`p-1 rounded w-full hover:bg-secondary ${
                  pubkey == counterparty() ? " bg-accent" : ""
                }`}
              >
                <ProfilePreview pubkey={pubkey} />
              </button>
            )}
          </For>
        </ul>
      </div>
      <input
        type="hidden"
        {...inputProps}
        id={props.name}
        value={counterparty()}
      />
    </div>
  );
}
