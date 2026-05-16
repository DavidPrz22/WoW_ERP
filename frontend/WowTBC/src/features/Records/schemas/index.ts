import { z } from "zod";

export const GetRecordsSchema = z.object({
  realm: z.string().optional(),
  faction: z.string().optional(),
  page: z.number().optional(),
  page_size: z.number().optional(),
});

export const GetRecordDataSchema = z.object({
  realm: z.string().min(1),
  faction: z.string().min(1),
  selected_record: z.string().min(1),
});

export type TGetRecordsParams = z.infer<typeof GetRecordsSchema>;
export type TGetRecordDataParams = z.infer<typeof GetRecordDataSchema>;
