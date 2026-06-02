/**
 * Dieser Code definiert den Where-Builder
 * @packageDocumentation
 */

import { type FussballerWhereInput } from '../../generated/prisma/models/Fussballer.ts';
import { type PositionType } from '../../generated/prisma/client.ts';
import { type Suchparameter } from './suchparameter.mts';
import { getLogger } from '../../logger/logger.mts';

export type BuildIdParams = {
    readonly id: number;
    readonly mitAuszeichnungen?: boolean;
};

const logger = getLogger('buildWhere', 'func');

/**
 * Ähnlich wie Spezification-Builder in Java zum Suchen mit flexiblen Where-Klauseln
 * @param suchparameter
 * @returns FussballerWehereInput
 */
export const buildWhere = ({ ...restProps }: Suchparameter) => {
    logger.debug('restProps=%o', restProps);
    const where: FussballerWhereInput = {};

    Object.entries(restProps).forEach(([key, value]) => {
        switch (key) {
            case 'nachname':
                where.nachname = { equals: value as string };
                break;

            case 'nationalitaet':
                where.nationalitaet = { equals: value as string };
                break;
            case 'position':
                // Enum
                where.position = { equals: value as PositionType };
                break;
            default:
                break;
        }
    });

    logger.debug('build: where=%o', where);
    return where;
};
