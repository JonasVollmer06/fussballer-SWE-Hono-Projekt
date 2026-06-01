// oxlint-disable no-magic-numbers

import {
    type FussballerMitAdresseUndAuszeichnungen,
    FussballerService,
} from './fussballer-service.mts';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { PositionType } from '../../generated/prisma/enums.ts';
import { PrismaClient } from '../../generated/prisma/client.ts';


const { findUniqueMock } = vi.hoisted(() => {
    return {
        findUniqueMock: vi.fn<PrismaClient['fussballer']['findUnique']>(),
    };
});

vi.mock(import('../../config/prisma-client.mts'), () => {
    return {
        prismaClient: {
            fussballer: {
                findUnique: findUniqueMock,
            },
        } as unknown as PrismaClient,
    };
});

describe('FussballerService findById', () => {
    let service: FussballerService;

    beforeEach(() => {
        service = new FussballerService();
        findUniqueMock.mockReset();
    });

    test('id ist vorhanden', async () => {
        // arrange
        const id = 20;
        const fussballerMock: Readonly<FussballerMitAdresseUndAuszeichnungen> = {
            id,
            version: 0,
            nachname: 'Vollmer',
            nationalitaet: 'Angola',
            position: PositionType.MITTELFELDSPIELER,
            geburtsdatum: new Date('2005-06-06'),
            username: 'jonas',
            erzeugt: new Date(),
            aktualisiert: new Date(),
            adresse: {
                id: 20,
                plz: '76831',
                ort: 'München',
                bundesland: 'BY',
                fussballerId: id,
            },
            auszeichnungen: [],
        };
        
        findUniqueMock.mockResolvedValueOnce(fussballerMock);

        // act
        const fussballer = await service.findById({ id });

        // assert
        expect(fussballer).toStrictEqual(fussballerMock);
    });

    test('id exisitiert nicht', async () => {
        // arrange
        const id = 808;
        findUniqueMock.mockResolvedValue(null);

        // act / assert
        await expect(service.findById({ id })).rejects.toThrow(
            `Es gibt keinen Fussballer mit der ID ${id}.`,
        );
    });
});