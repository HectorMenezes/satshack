import z from "zod";

export const pubkeySchema = z
  .string()
  .length(64)
  .regex(/^[0-9a-f]+$/, "Pubkey must be a valid hex string");

export const eventIdSchema = z
  .string()
  .length(64)
  .regex(/^[0-9a-f]+$/, "Event id must be a valid hex string");
