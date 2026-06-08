import { z } from "zod";

export const EngineeringDataQuerySchema = z.object({
  faction: z.string().min(1),
  realm: z.string().min(1),
  record_id: z.number().int().positive(),
});

export const EngReagentSchema = z.object({
  id: z.number(),
  name: z.string(),
  quantity: z.number(),
  min_buyout: z.number().nullable(),
  overriden_min_buyout: z.number().nullable(),
});

export const EngShoppingReagentSchema = z.object({
  name: z.string(),
  id: z.number(),
  qty: z.number(),
});

const reagentListGroupSchema = z.record(z.string(), z.array(EngShoppingReagentSchema));

export const EngItemSchema = z.object({
  name: z.string(),
  id_ingame: z.number(),
  type: z.string(),
  yield_quantity: z.number(),
  reagents: z.array(EngReagentSchema),
  min_buyout: z.number().nullable(),
  overriden_min_buyout: z.number().nullable(),
});

export const EngineeringApiResponseSchema = z.object({
  parts: z.array(EngItemSchema),
  explosives: z.array(EngItemSchema),
  total_reagents_used: z.object({
    Parts: reagentListGroupSchema,
    Explosives: reagentListGroupSchema,
  }),
});

export type TEngineeringDataQueryParams = z.infer<typeof EngineeringDataQuerySchema>;
export type TEngReagent = z.infer<typeof EngReagentSchema>;
export type TEngItem = z.infer<typeof EngItemSchema>;
export type TEngineeringApiResponse = z.infer<typeof EngineeringApiResponseSchema>;
