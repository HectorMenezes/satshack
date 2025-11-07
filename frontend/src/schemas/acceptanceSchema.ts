import z from "zod";
import { eventIdSchema, pubkeySchema } from "./miscSchema";

export const acceptanceSchema = z.object({
  proposalId: eventIdSchema,
  counterparty: pubkeySchema,
  proposer: pubkeySchema,
  escrow: pubkeySchema,
});

export type AcceptanceForm = z.infer<typeof acceptanceSchema>;
