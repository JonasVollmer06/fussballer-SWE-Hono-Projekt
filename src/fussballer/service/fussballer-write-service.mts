import { type FussballerFile, type Prisma } from '../../generated/prisma/client.ts';
import {
    NotFoundError,
    UsernameExistsError,
    VersionInvalidError,
    VersionOutdatedError,
} from './errors.mts';
import { FussballerService } from './fussballer-service.mts';
import { getLogger } from '../../logger/logger.mts';
import { prismaClient } from '../../config/prisma-client.mts';
import { sendmail } from '../../mail/sendmail.mts';

export type FussballerCreate = Prisma.FussballerCreateInput;

type FussballerCreated = Prisma.FussballerGetPayload<{
    include: {
        adresse: true;
        auszeichnungen: true;
    };
}>;

export type FussballerUpdate = Prisma.FussballerUpdateInput;

export type UpdateParams = {
    readonly id: number | undefined;
    readonly fussballer: FussballerUpdate;
    readonly version: string;
};

type FussballerUpdated = Prisma.FussballerGetPayload<{}>;

type FussballerFileCreate = Prisma.FussballerFileUncheckedCreateInput;
export type FussballerFileCreated = Prisma.FussballerFileGetPayload<{}>;

export class FussballerWriteService {
    private static readonly VERSION_PATTERN = /^"\d{1,3}"/u;

    readonly #readService: FussballerService;

    readonly #logger = getLogger(FussballerWriteService.name);

    constructor(readService: FussballerService) {
        this.#readService = readService;
    }

    async create(fussballer: FussballerCreate) {
        this.#logger.debug('create: fussballer=%o', fussballer);
        await this.#validateCreate(fussballer);

        let fussballerDb: FussballerCreated | undefined;
        await prismaClient.$transaction(async (tx) => {
            fussballerDb = await tx.fussballer.create({
                data: fussballer,
                include: {
                    adresse: true,
                    auszeichnungen: true,
                },
            });
        })

        await FussballerWriteService.#sendmail({
            id: fussballerDb?.id ?? 'N/A',
            nachname: fussballerDb?.nachname ?? 'N/A',
            username: fussballerDb?.username ?? 'N/A',
        });

        this.#logger.debug('create: fussballerDb.id=%s', fussballerDb?.id);
        return fussballerDb?.id ?? Number.NaN;
    }

    async update({ id, fussballer, version }: UpdateParams) {
        this.#logger.debug(
            'update: id=%s, fussballer=%o, version=%s',
            id,
            fussballer,
            version,
        );

        if (id === undefined) {
            this.#logger.debug('update: Keine gueltige ID');
            throw new NotFoundError(
                `Es gibt keinen Fussballer mit der ID ${id}.`,
            );
        }

        await this.#validateUpdate(id, version);

        fussballer.version = { increment: 1 };

        let fussballerUpdated: FussballerUpdated | undefined;
        await prismaClient.$transaction(async (tx) => {
            fussballerUpdated = await tx.fussballer.update({
                data: fussballer,
                where: { id },
            });
        });

        this.#logger.debug(
            'update: fussballerUpdated=%s',
            JSON.stringify(fussballerUpdated),
        );

        return fussballerUpdated?.version ?? Number.NaN;
    }
}
