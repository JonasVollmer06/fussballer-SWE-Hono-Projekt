// oxlint-disable max-lines

/**
 * Dieses Modul ist die Service-Datei für den Fussballer-Microservice
 *  @packageDocumentation
 */

import { type Prisma } from '../../generated/prisma/client.ts';
import { type FussballerInclude } from '../../generated/prisma/models/Fussballer.ts';
import { NotFoundError } from './errors.mts';
import { prismaClient } from '../../config/prisma-client.mts';
import { type Pageable } from './pageable.mts';
import { type Suchparameter, suchparameterNamen } from './suchparameter.mts';
import { type Slice } from './slice.mts';
import { getLogger } from '../../logger/logger.mts';
import { buildWhere } from './where-builder.mts';

type FindByIdParams = {
    readonly id: number;
    readonly mitAuszeichnungen?: boolean;
};

export type FussballerMitAdresse = Prisma.FussballerGetPayload<{
    include: { adresse: true };
}>;

export type FussballerMitAdresseUndAuszeichnungen =
    Prisma.FussballerGetPayload<{
        include: {
            adresse: true;
            auszeichnungen: true;
        };
    }>;

export class FussballerService {
    static readonly ID_PATTERN = /^[1-9]\d{0,10}$/u;
    readonly #includeAdresse: FussballerInclude = {
        adresse: true,
    };
    readonly #includeAdresseUndAbbildungen: FussballerInclude = {
        adresse: true,
        auszeichnungen: true,
    };

    readonly #logger = getLogger(FussballerService.name);

    /**
     * Asynchrone Methode zur Pfadparametersuche von Fussballern anhand einer id
     * @param id ID des zufindenen Fussballers
     * @return Das gefundene Fussballer-Objekt
     */
    async findById({
        id,
        mitAuszeichnungen,
    }: FindByIdParams): Promise<
        Readonly<FussballerMitAdresseUndAuszeichnungen>
    > {
        this.#logger.debug('findById: id=5d, id');
        const include = mitAuszeichnungen
            ? this.#includeAdresseUndAbbildungen
            : this.#includeAdresse;
        const fussballer: FussballerMitAdresseUndAuszeichnungen | null =
            await prismaClient.fussballer.findUnique({
                where: { id },
                include,
            });

        if (fussballer === null) {
            this.#logger.debug('Kein Buch mit der ID %d grfunden', id);
            throw new NotFoundError(
                `Kein Fussballer mit der ID ${id} gefunden.`,
            );
        }

        return fussballer;
    }

    /**
     * Fussballer anhand von Query-Params suchen
     * @param suchparameter JSON-Objekt mit Suchparametern als Inhalt
     * @returns Ein JSON-Array mit den gefundenen
     */
    async find(
        suchparameter: Suchparameter | null,
        pageable: Pageable,
    ): Promise<Readonly<Slice<Readonly<FussballerMitAdresse>>>> {
        this.#logger.debug(
            'find: suchparameter=%s, pageable=%o',
            JSON.stringify(suchparameter),
            pageable,
        );

        if (suchparameter === null) {
            return await this.#findAll(pageable);
        }
        const keys = Object.keys(suchparameter);

        if (keys.length === 0) {
            return await this.#findAll(pageable);
        }

        if (!this.#checkKeys(keys) || !this.#checkEnums(suchparameter)) {
            this.#logger.debug('Ungültige Suchparameter wurden übergeben.');
            throw new NotFoundError('Ungueltige Suchparameter');
        }

        const where = buildWhere(suchparameter);
        const { number, size } = pageable;
        const fussballers: FussballerMitAdresse[] =
            await prismaClient.fussballer.findMany({
                where,
                skip: number * size,
                take: size,
                include: this.#includeAdresse,
            });

        if (fussballers.length === 0) {
            this.#logger.debug('find: Keine passenden Fussballer gefunden');
            throw new NotFoundError(
                `Keine passenden Fussballer gefunden: ${JSON.stringify(suchparameter)}, Seite ${pageable.number}`,
            );
        }
        const totalElements = await this.count(where);
        return this.#createSlice(fussballers, totalElements);
    }

    async count(where?: Prisma.FussballerWhereInput) {
        this.#logger.debug('count:where=%o', where ?? 'undefined');
        const { count } = prismaClient.fussballer;
        const anzahl =
            where === undefined ? await count() : await count({ where });
        this.#logger.debug('count: %d=', anzahl);
        return anzahl;
    }

    async #findAll(
        pageable: Pageable,
    ): Promise<Readonly<Slice<FussballerMitAdresse>>> {
        const { number, size } = pageable;
        const fussballers: FussballerMitAdresse[] =
            await prismaClient.fussballer.findMany({
                skip: number * size,
                take: size,
                include: this.#includeAdresse,
            });
        if (fussballers.length === 0) {
            this.#logger.debug('#findAll: Keine passenden Fussballer gefunden');
            throw new NotFoundError(`Ungueltige Seite "${number}"`);
        }

        const totalElements = await this.count();
        return this.#createSlice(fussballers, totalElements);
    }

    #createSlice(
        fussballers: FussballerMitAdresse[],
        totalElements: number,
    ): Readonly<Slice<FussballerMitAdresse>> {
        const fussballerSlice: Slice<FussballerMitAdresse> = {
            content: fussballers,
            totalElements,
        };

        this.#logger.debug('createSlice: fussballerSlice=%o', fussballerSlice);
        return fussballerSlice;
    }

    #checkKeys(keys: string[]) {
        this.#logger.debug('#checkKeys: = keys=%o', keys);
        let validKeys = true;
        keys.forEach((key) => {
            if (!suchparameterNamen.includes(key)) {
                this.#logger.debug(
                    '#checkKeys: ungueltiger Suchparameter "%s"',
                    key,
                );
                validKeys = false;
            }
        });

        return validKeys;
    }

    #checkEnums(suchparameter: Suchparameter) {
        const { position } = suchparameter;
        this.#logger.debug('#checkenums: Suchparameter "art=%s"', position);
        return (
            position === undefined ||
            position === 'TORWART' ||
            position === 'VERTEIDIGER' ||
            position === 'MITTELFELDSPIELER' ||
            position === 'STUERMER'
        );
    }
}
