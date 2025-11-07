import z from "zod";
import { pubkeySchema } from "./miscSchema";

export const proposalSchema = z.object({
  content: z.string().min(1, "Description is too short."),
  amount: z.number().min(1, "Minimum amount is 1 sat."),
  proposer: pubkeySchema,
  counterparty: pubkeySchema,
  escrow: pubkeySchema,
});

export type ProposalForm = z.infer<typeof proposalSchema>;
