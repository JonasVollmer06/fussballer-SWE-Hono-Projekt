import {
    type FussballerCreate,
    FussballerWriteService,
} from './fussballer-write-service.mts';
import { Prisma, PrismaClient } from '../../generated/prisma/client.ts';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { FussballerService } from './fussballer-service.mts';
import { PositionType } from '../../generated/prisma/enums.ts';
