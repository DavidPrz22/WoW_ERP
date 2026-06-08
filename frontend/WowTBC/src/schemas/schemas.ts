import { z } from "zod";

export const GetRecordsSelectSchema = z.object({
    realm: z.string().min(1),
    faction: z.string().min(1),
});

export const GetRecordDataSchema = z.object({
    realm: z.string().min(1),
    faction: z.string().min(1),
    selected_record: z.string().min(1),
});

export const GetJewelcraftingItemsSchema = z.object({
    faction: z.string().min(1),
    realm: z.string().min(1),
    record_id: z.number().int().positive(),
});

export const GetCookingGroupsDataSchema = z.object({
    faction: z.string().min(1),
    realm: z.string().min(1),
    selected_record: z.string().min(1),
});


export type TGetRecordsSelectParams = z.infer<typeof GetRecordsSelectSchema>
export type TGetRecordDataParams = z.infer<typeof GetRecordDataSchema>;
export type TGetJewelcraftingItemsParams = z.infer<typeof GetJewelcraftingItemsSchema>;
export type TGetCookingGroupsDataParams = z.infer<typeof GetCookingGroupsDataSchema>;
