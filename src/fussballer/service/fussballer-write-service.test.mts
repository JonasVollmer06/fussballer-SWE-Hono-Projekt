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

const createFussballer = (): FussballerCreate => {
    return {
        version: 0,
        nachname: 'Mueller',
        nationalitaet: 'Deutsch',
        position: PositionType.STUERMER,
        geburtsdatum: new Date('2000-01-01'),
        username: 'mueller',
        adresse: {
            create: {
                plz: '76133',
                ort: 'Karlsruhe',
                bundesland: 'Baden-Wuerttemberg',
            },
        },
        auszeichnungen: {
            create: [],
        },
    };
};

const createFussballerMock = (
    fussballer: FussballerCreate,
    idMock: number,
) => {
    return {
        id: idMock,
        version: fussballer.version,
        nachname: fussballer.nachname,
        nationalitaet: fussballer.nationalitaet,
        position: fussballer.position,
        geburtsdatum: fussballer.geburtsdatum,
        username: fussballer.username,
        erzeugt: new Date(),
        aktualisiert: new Date(),
        adresse: {
            id: 11,
            plz: '76133',
            ort: 'Karlsruhe',
            bundesland: 'Baden-Wuerttemberg',
            fussballerId: idMock,
        },
        auszeichnungen: [],
    };
};
