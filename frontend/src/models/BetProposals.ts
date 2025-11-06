import { betProposalsLoader } from "@/libs/loaders";
import { KINDS } from "@/libs/nostr";
import { Model } from "applesauce-core";
import { getTagValue } from "applesauce-core/helpers";
import { NostrEvent } from "nostr-tools";
import { map } from "rxjs";
import { formatDate } from "@/libs/utils";

export type BetProposal = {
  content: string;
  amount: number;
  proposer: string;
  counterparty: string;
  escrow: string;
  date: string;
}[];

function presenter(proposalEvent: NostrEvent) {
  return {
    content: proposalEvent.content.substring(0, 200),
    amount: parseInt(getTagValue(proposalEvent, "amount")!),
    proposer: proposalEvent.pubkey,
    counterparty: getTagValue(proposalEvent, "counterparty")!,
    escrow: getTagValue(proposalEvent, "escrow")!,
    date: formatDate(proposalEvent.created_at),
  };
}

export function BetProposalsModel(): Model<BetProposal | []> {
  betProposalsLoader().subscribe();

  return (store) =>
    store
      .timeline({
        kinds: [KINDS.BET_PROPOSAL],
      })
      .pipe(map((proposals) => proposals.map((p) => presenter(p))));
}
