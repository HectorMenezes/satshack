import { betProposalsLoader, eventLoader } from "@/libs/loaders";
import { KINDS } from "@/libs/nostr";
import { Model } from "applesauce-core";
import { getTagValue } from "applesauce-core/helpers";
import { NostrEvent } from "nostr-tools";
import {
  combineLatest,
  concatMap,
  map,
  mergeMap,
  of,
  scan,
  startWith,
  switchMap,
  take,
  tap,
  withLatestFrom,
} from "rxjs";
import { formatDate } from "@/libs/utils";

export type BetProposal = {
  eventId: string;
  content: string;
  amount: number;
  proposer: string;
  counterparty: string;
  escrow: string;
  accepted: boolean;
  date: string;
};

function presenter(proposalEvent: NostrEvent, acceptanceEvent?: NostrEvent) {
  return {
    eventId: proposalEvent.id,
    content: proposalEvent.content.substring(0, 200),
    amount: parseInt(getTagValue(proposalEvent, "amount")!),
    proposer: proposalEvent.pubkey,
    counterparty: getTagValue(proposalEvent, "counterparty")!,
    escrow: getTagValue(proposalEvent, "escrow")!,
    accepted: acceptanceEvent != undefined,
    date: formatDate(proposalEvent.created_at),
  };
}

export function BetProposalsModel(): Model<BetProposal[] | []> {
  betProposalsLoader().subscribe();

  return (store) =>
    store
      .filters([
        {
          kinds: [KINDS.BET_PROPOSAL],
        },
      ])
      .pipe(
        mergeMap((proposal) =>
          store
            .filters({
              kinds: [KINDS.BET_ACCEPTANCE],
              "#e": [proposal.id], // match acceptance by proposal id
            })
            .pipe(
              // take the first acceptance event and then complete
              take(1),
              tap((acceptance) => eventLoader({ id: acceptance.id })),
              // if no acceptance has come yet, start with null
              startWith<NostrEvent | undefined>(undefined),
              // map to a pair
              map((acceptance) => ({
                id: proposal.id,
                value: presenter(proposal, acceptance), // your final object
              }))
            )
        ),
        scan((acc, { id, value }) => {
          acc.set(id, value);
          // emit a new Map instance to ensure change detection
          return new Map(acc);
        }, new Map<string, BetProposal>()),

        // Project Map -> Array (order ignored)
        map((m: any) => Array.from(m.values()))
      );
}
