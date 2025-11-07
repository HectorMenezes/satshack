import { accounts } from "@/libs/accounts";
import { KINDS, pool, RELAYS } from "@/libs/nostr";
import { BetProposal, BetProposalsModel } from "@/models/BetProposals";
import { eventStore } from "@/stores/eventStore";
import { mapEventsToStore } from "applesauce-core";
import { onlyEvents } from "applesauce-relay";
import { Component, For, from, Match, Switch } from "solid-js";
import ProfilePicture from "./ProfilePicture";
import { ProfilePreview } from "./ProfilePreview";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "./ui/card";
import { Button } from "./ui/button";
import { actionHub } from "@/actionHub";
import { AcceptProposalAction } from "@/actions/acceptProposal";

const proposals = from(eventStore.model(BetProposalsModel));

function handleAccept(proposal: BetProposal) {
  actionHub.run(AcceptProposalAction, proposal);
}

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
                <div class="flex text-sm">
                  <ProfilePreview pubkey={proposal.escrow} hideNip05={true} />
                </div>
                <div class="text-right text-lg w-full">
                  <Switch>
                    <Match when={!proposal.accepted}>
                      <Button size="sm" onClick={() => handleAccept(proposal)}>
                        Accept {proposal.amount} sats
                      </Button>
                    </Match>
                    <Match when={proposal.accepted}>
                      <div class="font-bold text-green-800">Accepted</div>
                    </Match>
                  </Switch>
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
