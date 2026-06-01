import { z } from 'zod';

export const MAX_VARCHAR_LENGTH = 64;

const idSchema = z.union([
    z.number().int().gt(0),
    z.string().regex(/^[1-9]\d*$/u),
]);

const nameSchema = z
    .string()
    .regex(/^[A-ZÄÖÜ][a-zäöüß]+(-[A-ZÄÖÜ][a-zäöüß]+)?$/u)
    .max(MAX_VARCHAR_LENGTH);

const usernameSchema = z
    .string()
    .regex(/^\S.*$/u)
    .min(1)
    .max(20);

const AdresseSchema = z.strictObject({
    plz: z.string().regex(/^\d{5}$/u),
    ort: z
        .string()
        .regex(/^\S.*$/u)
        .max(MAX_VARCHAR_LENGTH),
    bundesland: z
        .string()
        .regex(/^\S.*$/u)
        .max(21),
});

const AuszeichnungSchema = z.strictObject({
    bezeichnung: z
        .string()
        .regex(/^\S.*$/u)
        .max(MAX_VARCHAR_LENGTH),
    saison: z.string().regex(/^(\d{4})(\/\d{2})?$/u),
});

const FussballerComplete = z.strictObject({
    id: idSchema,
    version: z.int().gte(0),
    nachname: nameSchema,
    nationalitaet: nameSchema,
    position: z
        .enum(['TORWART', 'VERTEIDIGER', 'MITTELFELDSPIELER', 'STUERMER'])
        .optional(),
    geburtsdatum: z.coerce.date(),
    username: usernameSchema,
    adresse: AdresseSchema,
    auszeichnungen: z.array(AuszeichnungSchema).optional(),
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
