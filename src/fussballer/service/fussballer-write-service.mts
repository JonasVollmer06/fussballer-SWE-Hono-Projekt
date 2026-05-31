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
