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
}
