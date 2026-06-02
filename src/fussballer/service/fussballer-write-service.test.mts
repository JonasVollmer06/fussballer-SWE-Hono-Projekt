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
            transactionBody: (tx: Prisma.TransactionClient) => Promise<unknown>,
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
                bundesland: 'BW',
            },
        },
        auszeichnungen: {
            create: [],
        },
    };
};

const createFussballerMock = (fussballer: FussballerCreate, idMock: number) => {
    const fussballerTmp: any = { ...fussballer };
    fussballerTmp.id = idMock;
    fussballerTmp.erzeugt = new Date();
    fussballerTmp.aktualisiert = new Date();
    fussballerTmp.adresse.create.id = 11;
    fussballerTmp.adresse.create.fussballerId = idMock;
    return fussballerTmp;
};

describe('FussballerWriteService create', () => {
    let service: FussballerWriteService;
    let readService: FussballerService;

    beforeEach(() => {
        readService = new FussballerService();
        service = new FussballerWriteService(readService);

        createMock.mockReset();
        countMock.mockReset();
        transactionMock.mockReset();
        sendmailMock.mockReset();

        setupTransactionMock();
    });

    test('Neuer Fussballer', async () => {
        // given
        const idMock = 1;
        const fussballer = createFussballer();

        // Username existiert noch nicht
        countMock.mockResolvedValue(0);

        createMock.mockResolvedValue(createFussballerMock(fussballer, idMock));

        // sendmail ist eine void-Funktion
        sendmailMock.mockResolvedValue(null);

        // when
        const id = await service.create(fussballer);

        // then
        expect(id).toBe(idMock);
        expect(sendmailMock).toHaveBeenCalledOnce();
    });
});
