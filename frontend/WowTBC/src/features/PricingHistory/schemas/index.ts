import { z } from "zod";

export const PricingSearchValuesSchema = z.object({
  searchTerm: z.string(),
  class: z.string().optional(),
  subclass: z.string().optional(),
  quality: z.string().optional(),
});

export const PricingHistorySchema = z.object({
  item_id: z.string(),
  faction: z.string(),
  realm: z.string(),
  range: z.object({
    from: z.date().or(z.undefined()),
    to: z.date().optional()
  }).optional()
}).transform((data) => {
  const { range, ...rest } = data;
  
  let from_date = range?.from;
  let to_date = range?.to;

  if (from_date) {
    from_date = new Date(from_date);
    from_date.setHours(0, 0, 0, 0);
  }

  if (to_date) {
    to_date = new Date(to_date);
    to_date.setHours(23, 59, 59, 999);
  }

  return {
    ...rest,
    from_date: from_date?.toISOString(),
    to_date: to_date?.toISOString()
  };
});

export type TPricingSearchValues = z.infer<typeof PricingSearchValuesSchema>;
export type TPricingHistoryInput = z.input<typeof PricingHistorySchema>;
export type TPricingHistoryValues = z.infer<typeof PricingHistorySchema>;
