import { z } from "zod";

export const BoeDataQuerySchema = z.object({
  realm: z.string().min(1),
  faction: z.string().min(1),
  record_id: z.number().int().positive(),
});

export const BoeApiReagentSchema = z.object({
  id: z.number(),
  name: z.string(),
  quantity: z.number(),
  min_buyout: z.number().nullable(),
  overriden_min_buyout: z.number().nullable(),
  is_nether_input: z.enum(["primal", "vortex"]).nullable(),
});

export const BoeApiItemSchema = z.object({
  name: z.string(),
  min_buyout: z.number().nullable(),
  overriden_min_buyout: z.number().nullable(),
  yield_quantity: z.number(),
  reagents: z.array(BoeApiReagentSchema),
});

export const BoeApiCategorySchema = z.object({
  category: z.string(),
  items: z.array(BoeApiItemSchema),
});

export const BoeApiProfessionSchema = z.object({
  profession: z.string(),
  items: z.array(BoeApiCategorySchema),
});

export const BoeApiResponseSchema = z.array(BoeApiProfessionSchema);

export const BoeApiDataResponseSchema = z.object({
  data: BoeApiResponseSchema,
});
