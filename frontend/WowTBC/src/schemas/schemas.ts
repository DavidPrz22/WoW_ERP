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


export type TGetRecordsSelectParams = z.infer<typeof GetRecordsSelectSchema>
export type TGetRecordDataParams = z.infer<typeof GetRecordDataSchema>;
