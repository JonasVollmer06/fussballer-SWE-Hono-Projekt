import { z } from 'zod';

export const MAX_VARCHAR_LENGTH = 40;

const idSchema = z.union([
    z.number().int().gt(0),
    z.string().regex(/^[1-9]\d*$/u),
]);

const varcharSchema = z
    .string()
    .regex(/^\S.*$/u)
    .max(MAX_VARCHAR_LENGTH);

const FussballerComplete = z.strictObject({
    // Bei GraphQL ist der Typ ID i.a. ein String.
    id: idSchema,
    version: z.int().gte(0),
    nachname: varcharSchema,
    nationalitaet: varcharSchema,
    position: z
        .enum(['TORWART', 'VERTEIDIGER', 'MITTELFELDSPIELER', 'STUERMER'])
        .optional(),
    geburtsdatum: z.coerce.date().optional(),
    username: varcharSchema,
    adresse: z.strictObject({
        plz: z.string().regex(/^\d{5}$/u),
        ort: varcharSchema,
        bundesland: varcharSchema,
    }),
    auszeichnungen: z
        .array(
            z.strictObject({
                bezeichnung: varcharSchema,
                saison: varcharSchema,
            }),
        )
        .optional(),
});

export const FussballerNeuSchema = FussballerComplete.omit({
    id: true,
    version: true,
}).readonly();

export const FussballerUpdateSchema = FussballerComplete.omit({
    id: true,
    version: true,
    username: true,
    adresse: true,
    auszeichnungen: true,
}).readonly();

export type FussballerNeuType = z.infer<typeof FussballerNeuSchema>;
export type FussballerUpdateType = z.infer<typeof FussballerUpdateSchema>;
