import { BetProposalsModel } from "@/models/BetProposals";
import { eventStore } from "@/stores/eventStore";
import { Component, from } from "solid-js";

const proposals = from(eventStore.model(BetProposalsModel));

const ProposalList: Component = () => {
  return (
    <div class="w-full">
      <h2>Bet Proposals</h2>
    </div>
  );
};

export default ProposalList;
