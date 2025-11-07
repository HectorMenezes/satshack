import { accounts } from "@/libs/accounts";
import { from } from "solid-js";
import { Button } from "./ui/button";
import { useAuth } from "../contexts/authContext";
import User from "./User";
import CreateProposal from "./CreateProposal";

export default function Navbar() {
  const account = from(accounts.active$);
  const { setDialogIsOpen } = useAuth();

  return (
    <nav class="bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-12 items-center">
          <div class="flex justify-start items-center">
            <div class="flex-shrink-0">
              <h1 class="text-xl font-bold text-gray-800 dark:text-gray-100 mr-4">
                <a href="/">Betr</a>
              </h1>
            </div>
            <div class="flex gap-4">
              {account() !== undefined ? <CreateProposal /> : ""}
            </div>
          </div>
          <div class="flex items-center gap-2">
            {account() === undefined ? (
              <Button
                variant="default"
                size="sm"
                onClick={() => setDialogIsOpen(true)}
              >
                Sign In
              </Button>
            ) : (
              <div class="flex items-center gap-4">
                <User />
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
