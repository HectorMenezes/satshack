import { accounts } from "@/libs/accounts";
import { ProposalForm, proposalSchema } from "@/schemas/proposalSchema";
import {
  createForm,
  getValue,
  getValues,
  reset,
  submit,
  SubmitHandler,
  validate,
  zodForm,
} from "@modular-forms/solid";
import { createSignal, from, Show } from "solid-js";
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
import EscrowSelection from "./EscrowSelection";
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
  const [step, setStep] = createSignal(1);
  const [counterparty, setCounterparty] = createSignal<string | undefined>(
    undefined
  );
  const [form, { Form, Field }] = createForm<ProposalForm>({
    validate: zodForm(proposalSchema as any),
  });

  function handleContinue() {
    const values = getValues(form);
    if (values.amount && values.content && values.counterparty) setStep(2);
  }

  function handleBack() {
    setStep(1);
  }

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
        <Form onSubmit={handleSubmit} class="max-w-md">
          <DialogHeader>
            <DialogTitle class="text-center">Propose a Bet</DialogTitle>
          </DialogHeader>

          <div class={step() != 1 ? "hidden" : ""}>
            <Field name="proposer" type="string">
              {(field, props) => (
                <input type="hidden" {...props} value={account()?.pubkey} />
              )}
            </Field>
            <Field name="amount" type="number">
              {(field, props) => (
                <NumberField
                  defaultValue={10000}
                  minValue={0}
                  format={false}
                  class="mb-2"
                >
                  <NumberFieldLabel>Stake in Sats</NumberFieldLabel>
                  <NumberFieldGroup>
                    <NumberFieldDecrementTrigger aria-label="Decrement" />
                    <NumberFieldInput
                      value={field.value}
                      {...props}
                      type="number"
                    />
                    <NumberFieldIncrementTrigger aria-label="Increment" />
                  </NumberFieldGroup>
                </NumberField>
              )}
            </Field>

            <Field name="content" type="string">
              {(field, props) => (
                <TextFieldRoot class="mb-2">
                  <TextFieldLabel>Bet Description</TextFieldLabel>
                  <TextArea
                    {...props}
                    placeholder="Clearly state what the bet is about and the specific result that will determine the winner."
                  />
                </TextFieldRoot>
              )}
            </Field>
            <Field name="counterparty" type="string">
              {(field, props) => (
                <CounterpartySelection
                  form={form}
                  value={field.value}
                  {...props}
                  onChange={(pubkey: any) =>
                    setCounterparty(pubkey) && console.log(pubkey)
                  }
                />
              )}
            </Field>
            <Button class="mt-2 w-full" onClick={handleContinue}>
              Continue
            </Button>
          </div>
          <div class={step() != 2 ? "hidden" : ""}>
            <div class="mt-4">
              <Field name="escrow" type="string">
                {(field, props) => (
                  <EscrowSelection
                    counterparty={counterparty()}
                    form={form}
                    value={field.value}
                    {...props}
                  />
                )}
              </Field>
            </div>
            <div class="w-full flex mt-2">
              <Button class="mt-2 w-full" variant="link" onClick={handleBack}>
                Back
              </Button>
              <Button class="mt-2 w-full" onClick={() => submit(form)}>
                Submit
              </Button>
            </div>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
