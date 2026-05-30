// oxlint-disable max-lines

/**
 * Dieses Modul ist die Service-Datei für den Fussballer-Microservice
 *  @packageDocumentation
 */

import { type Prisma} from '../../generated/prisma/client.ts';
import { type FussballerInclude } from '../../generated/prisma/models/Fussballer.ts';
import { NotFoundError }  from './errors.mts';
import { prismaClient } from '../../config/prisma-client.mts';
import { type Pageable } from './pageable.mts';
import { type Suchparameter, suchparameterNamen} from './suchparameter.mts';
import { type Slice } from './slice.mts';


type FindByIdParams = {
    readonly id: number;
    readonly mitAuszeichnungen?: boolean;
};

export type FussballerMitAdresse = Prisma.FussballerGetPayload<{
    include: { adresse: true};
}>;

export type FussballerMitAdresseUndAuszeichnungen = Prisma.FussballerGetPayload<{
    include: {
        adresse: true;
        auszeichnungen: true;
    };
}>;

export class FussballerService {
    static readonly ID_PATTERN = /^[1-9]\d{0,10}$/u;
    readonly #includeAdresse: FussballerInclude = { 
        adresse: true
    };
    readonly #includeAdresseUndAbbildungen: FussballerInclude = {
        adresse: true,
        auszeichnungen: true,
    };

    /**
     * Asynchrone Methode zur Pfadparametersuche von Fussballern anhand einer id
     * @param id ID des zufindenen Fussballers
     * @return Das gefundene Fussballer-Objekt
     */
    async findById({
        id,
        mitAuszeichnungen,  
    }: FindByIdParams): Promise<Readonly<FussballerMitAdresseUndAuszeichnungen>> {
        const include = mitAuszeichnungen ? this.#includeAdresseUndAbbildungen : this.#includeAdresse;
        const fussballer: FussballerMitAdresseUndAuszeichnungen | null = await prismaClient.fussballer.findUnique({
            where: { id },
            include,
        });

        if(fussballer === null) {
            throw new NotFoundError(`Kein Fussballer mit der ID ${id} gefunden.`);
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
        if (suchparameter === null) {
            return await this.#findAll(page)
        }
    }
}