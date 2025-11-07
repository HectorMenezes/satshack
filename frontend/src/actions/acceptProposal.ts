import { Action } from "applesauce-actions";
import { KINDS } from "@/libs/nostr";
import { type BetProposal } from "@/models/BetProposals";

export function AcceptProposalAction(proposal: BetProposal): Action {
  return async function* ({ factory }) {
    const created_at = Math.floor(Date.now() / 1000);

    const draft = {
      pubkey: proposal.proposer,
      kind: KINDS.BET_ACCEPTANCE,
      content: "",
      tags: [
        ["e", proposal.eventId],
        ["p", proposal.counterparty],
        ["p", proposal.escrow],
      ],
      created_at,
    };

    yield await factory.sign(draft);
  };
}
