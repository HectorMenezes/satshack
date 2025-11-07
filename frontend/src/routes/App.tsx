import ProposalList from "@/components/ProposalList";
import { type Component } from "solid-js";

const App: Component = () => {
  return (
    <main class="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-2 sm:py-4 lg:py-6">
      <ProposalList />
    </main>
  );
};

export default App;
