import { z } from "zod";

export const PricingSearchValuesSchema = z.object({
  searchTerm: z.string(),
  class: z.string().optional(),
  subclass: z.string().optional(),
  quality: z.string().optional(),
});

export const PricingHistorySchema = z.object({
  item_id: z.string(),
  faction_id: z.string(),
  realm_id: z.number(),
  from_date: z.string().optional(),
  to_date: z.string().optional()
});

export type TPricingSearchValues = z.infer<typeof PricingSearchValuesSchema>;
export type TPricingHistoryValues = z.infer<typeof PricingHistorySchema>;
