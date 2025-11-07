import { accounts } from "@/libs/accounts";
import { KINDS, pool, RELAYS } from "@/libs/nostr";
import { BetProposalsModel } from "@/models/BetProposals";
import { eventStore } from "@/stores/eventStore";
import { mapEventsToStore } from "applesauce-core";
import { onlyEvents } from "applesauce-relay";
import { Component, For, from } from "solid-js";
import ProfilePicture from "./ProfilePicture";
import { ProfilePreview } from "./ProfilePreview";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "./ui/card";

const account = from(accounts.active$);

const proposals = from(eventStore.model(BetProposalsModel));

const ProposalList: Component = () => {
  return (
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
      <For each={proposals()}>
        {(proposal) => (
          <Card class="flex flex-col h-full">
            <CardHeader>
              <div class="flex col-3 w-full">
                <div class="col-1 mb-2 w-full">
                  <ProfilePreview pubkey={proposal.proposer} hideNip05={true} />
                </div>
                <div class="col-1 font-bold px-4 w-full text-center">VS</div>
                <div class="col-1 mb-2 w-full flex justify-end">
                  <ProfilePreview
                    pubkey={proposal.counterparty}
                    hideNip05={true}
                    right={true}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>{proposal.content}</CardDescription>
            </CardContent>
            <CardFooter>
              <div class="flex flex-row w-full">
                <div class="flex">
                  <ProfilePreview pubkey={proposal.escrow} hideNip05={true} />
                </div>
                <div class="text-right text-lg w-full">
                  <span class="">{proposal.amount}</span> sats
                </div>
              </div>
            </CardFooter>
          </Card>
        )}
      </For>
    </div>
  );
};

export default ProposalList;
