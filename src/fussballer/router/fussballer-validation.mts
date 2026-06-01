import { z } from 'zod';

const NAME_PATTERN = /^[A-ZÄÖÜ][a-zäöüß]+(-[A-ZÄÖÜ][a-zäöüß]+)?$/u;
const PLZ_PATTERN = /^\d{5}$/u;
const SAISON_PATTERN = /^(\d{4})(\/\d{2})?$/u;
const AUSZEICHNUNG_PATTERN =
    /^[A-ZÄÖÜ][A-Za-zÄÖÜäöüß]*(?:[ -][A-ZÄÖÜ][A-Za-zÄÖÜäöüß]*)*$/u;

const AdresseSchema = z.strictObject({
    plz: z.string().regex(PLZ_PATTERN),
    ort: z.string().max(64),
    bundesland: z.string().max(21),
});

const AuszeichnungSchema = z.strictObject({
    bezeichnung: z.string().regex(AUSZEICHNUNG_PATTERN).max(64),
    saison: z.string().regex(SAISON_PATTERN),
});

const FussballerComplete = z.strictObject({
    id: z.union([z.number().int().gt(0), z.string().regex(/^[1-9]\d*$/u)]),
    version: z.int().gte(0),

    nachname: z.string().regex(NAME_PATTERN).max(64),
    nationalitaet: z.string().regex(NAME_PATTERN).max(64),
    position: z
        .enum(['TORWART', 'VERTEIDIGER', 'MITTELFELDSPIELER', 'STUERMER'])
        .optional(),
    geburtsdatum: z.coerce.date(),
    username: z.string().min(1).max(20),

    adresse: AdresseSchema,
    auszeichnungen: z.array(AuszeichnungSchema).optional(),
});
