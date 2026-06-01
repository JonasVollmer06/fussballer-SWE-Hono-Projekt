// oxlint-disable max-lines-per-function, no-magic-numbers

import {
    type FussballerMitAdresseUndAuszeichnungen,
    FussballerService,
} from './fussballer-service.mts';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { PositionType } from '../../generated/prisma/enums.ts';
import { PrismaClient } from '../../generated/prisma/client.ts';
import { type Pageable } from './pageable.mts';
import { type Suchparameter } from './suchparameter.mts';

const { findManyMock, countMock } = vi.hoisted(() => {
    return {
        findManyMock: vi.fn<PrismaClient['fussballer']['findMany']>(),
        countMock: vi.fn<PrismaClient['fussballer']['count']>(),
    };
});

vi.mock(import('../../config/prisma-client.mts'), () => {
    return {
        prismaClient: {
            fussballer: {
                findMany: findManyMock,
                count: countMock,
            },
        } as unknown as PrismaClient,
    };
});

describe('FussballerService find', () => {
    let service: FussballerService;

    beforeEach(() => {
        service = new FussballerService();
        findManyMock.mockReset();
        countMock.mockReset();
    });

    test('nachname vorhanden', async () => {
        // arrange
        const nachname = 'Hery';
        const suchparameter: Suchparameter = { nachname };
        const pageable: Pageable = { number: 1, size: 5 };
        const fussballerMock: FussballerMitAdresseUndAuszeichnungen = {
            id: 40,
            version: 0,
            nachname: nachname,
            nationalitaet: 'Türkei',
            position: PositionType.MITTELFELDSPIELER,
            geburtsdatum: new Date('2004-12-13'),
            username: 'tom',
            erzeugt: new Date(),
            aktualisiert: new Date(),
            adresse: {
                id: 40,
                plz: '76761',
                ort: 'Ingenheim',
                bundesland: 'RP',
                fussballerId: 40,
            },
            auszeichnungen: [],
        };
        findManyMock.mockResolvedValueOnce([fussballerMock]);
        countMock.mockResolvedValueOnce(1);

        // act
        const result = await service.find(suchparameter, pageable);

        // assert
        const { content } = result;

        expect(content).toHaveLength(1);
        expect(content[0]).toStrictEqual(fussballerMock);
    });

    test('nachname existiert nicht', async () => {
        // arrange
        const nachname = 'TestName';
        const suchparameter: Suchparameter = { nachname };
        const pageable: Pageable = { number: 1, size: 5 };

        findManyMock.mockResolvedValue([]);

        // act / assert
        await expect(service.find(suchparameter, pageable)).rejects.toThrow(
            /^Keine passenden Fussballer gefunden/u,
        );
    });
});
