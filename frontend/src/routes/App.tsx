import ProposalList from "@/components/ProposalList";
import { type Component } from "solid-js";

const App: Component = () => {
  return (
    <div class="flex-1 max-w-[1200px] mx-auto px-6 py-6 w-full">
      <div class="columns-2 gap-4">
        <ProposalList />
      </div>
    </div>
  );
};

export default App;
