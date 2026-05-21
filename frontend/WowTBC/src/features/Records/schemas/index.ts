import { z } from "zod";

export const GetRecordsSchema = z.object({
  realm: z.string().optional(),
  faction: z.string().optional(),
  page: z.number().optional(),
  page_size: z.number().optional(),
});

export type TGetRecordsParams = z.infer<typeof GetRecordsSchema>;

