import { accounts } from "@/libs/accounts";
import { ProposalForm, proposalSchema } from "@/schemas/proposalSchema";
import {
  createForm,
  reset,
  SubmitHandler,
  zodForm,
} from "@modular-forms/solid";
import { createSignal, from } from "solid-js";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { actionHub } from "@/actionHub";
import { CreateProposalAction } from "@/actions/createProposal";
import { TextArea } from "./ui/textarea";
import CounterpartySelection from "./CounterpartySelection";
import { TextFieldLabel, TextFieldRoot } from "./ui/textfield";
import {
  NumberField,
  NumberFieldDecrementTrigger,
  NumberFieldGroup,
  NumberFieldIncrementTrigger,
  NumberFieldInput,
  NumberFieldLabel,
} from "./ui/number-field";

export default function CreateProposal() {
  const account = from(accounts.active$);
  const [isOpen, setIsOpen] = createSignal(false);
  const [form, { Form, Field }] = createForm<ProposalForm>({
    validate: zodForm(proposalSchema as any),
  });

  const handleSubmit: SubmitHandler<ProposalForm> = async (values) => {
    actionHub.run(CreateProposalAction, values);

    reset(form);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen()} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <Button variant="link">Create a Bet</Button>
      </DialogTrigger>
      <DialogContent>
        {/* <Form onSubmit={handleSubmit}> */}
        <DialogHeader>
          <DialogTitle class="text-center">Propose a Bet</DialogTitle>
        </DialogHeader>
        <NumberField defaultValue={10000} minValue={0}>
          <NumberFieldLabel>Stake in Sats</NumberFieldLabel>
          <NumberFieldGroup>
            <NumberFieldDecrementTrigger aria-label="Decrement" />
            <NumberFieldInput />
            <NumberFieldIncrementTrigger aria-label="Increment" />
          </NumberFieldGroup>
        </NumberField>
        <TextFieldRoot>
          <TextFieldLabel>Bet Description</TextFieldLabel>
          <TextArea placeholder="Clearly state what the bet is about and the specific result that will determine the winner." />
        </TextFieldRoot>
        <CounterpartySelection />
        {/* </Form> */}
      </DialogContent>
    </Dialog>
  );
}
