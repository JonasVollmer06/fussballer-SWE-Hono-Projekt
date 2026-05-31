import {
    type FussballerCreate,
    FussballerWriteService,
} from './fussballer-write-service.mts';
import { Prisma, PrismaClient } from '../../generated/prisma/client.ts';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { FussballerService } from './fussballer-service.mts';
import { PositionType } from '../../generated/prisma/enums.ts';

// Hoisting
const { createMock, countMock, transactionMock, sendmailMock } = vi.hoisted(
    () => {
        return {
            createMock: vi.fn<Prisma.FussballerDelegate['create']>(),
            countMock: vi.fn<Prisma.FussballerDelegate['count']>(),
            transactionMock: vi.fn(), // oxlint-disable-line vitest/require-mock-type-parameters
            sendmailMock: vi.fn(), // oxlint-disable-line vitest/require-mock-type-parameters
        };
    },
);

// vi.mock() bewirkt Hoisting
vi.mock(import('../../config/prisma-client.mts'), () => {
    return {
        prismaClient: {
            fussballer: {
                create: createMock,
                count: countMock,
            },
            $transaction: transactionMock,
        } as unknown as PrismaClient,
    };
});

vi.mock(import('../../mail/sendmail.mts'), () => {
    return {
        sendmail: sendmailMock,
    };
});

const setupTransactionMock = () => {
    transactionMock.mockImplementation(
        async (
            transactionBody: (
                tx: Prisma.TransactionClient,
            ) => Promise<unknown>,
        ) =>
            await transactionBody({
                fussballer: {
                    create: createMock,
                    count: countMock,
                },
            } as unknown as Prisma.TransactionClient),
    );
};
