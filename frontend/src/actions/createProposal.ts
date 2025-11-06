import { Action } from "applesauce-actions";
import { NostrEvent } from "nostr-tools";
import { KINDS } from "@/libs/nostr";
import { ProposalForm } from "@/schemas/proposalSchema";

export function CreateProposalAction(form: ProposalForm): Action {
  return async function* ({ factory }) {
    const created_at = Math.floor(Date.now() / 1000);

    const draft = {
      pubkey: form.proposer,
      kind: KINDS.BET_PROPOSAL,
      content: form.content,
      tags: [
        ["amount", form.amount.toString()],
        ["counterparty", form.counterparty],
        ["escrow", form.escrow],
        ["p", form.counterparty],
        ["p", form.escrow],
      ],
      created_at,
    };

    yield await factory.sign(draft);
  };
}
