import { Action } from "applesauce-actions";
import { NostrEvent } from "nostr-tools";
import { KINDS } from "@/libs/nostr";
import { AcceptanceForm } from "@/schemas/acceptanceSchema";

export function CreateProposalAction(form: AcceptanceForm): Action {
  return async function* ({ factory }) {
    const created_at = Math.floor(Date.now() / 1000);

    const draft = {
      pubkey: form.proposer,
      kind: KINDS.BET_ACCEPTANCE,
      content: "",
      tags: [
        ["e", form.proposalId],
        ["p", form.proposer],
        ["p", form.escrow],
      ],
      created_at,
    };

    yield await factory.sign(draft);
  };
}
