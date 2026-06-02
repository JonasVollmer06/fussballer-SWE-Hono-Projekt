// oxlint-disable max-lines-per-function

import {
    APPLICATION_JSON,
    AUTHORIZATION,
    BEARER,
    CONTENT_TYPE,
    LOCATION,
    POST,
    restURL,
} from '../constants.mts';
import { beforeAll, describe, expect, test } from 'vitest';
import { type FussballerNeuType } from '../../../src/fussballer/router/fussballer-validation.mts';
import { FussballerService } from '../../../src/fussballer/service/fussballer-service.mts';
import { type ProblemDetails } from '../../../src/problem-details.mts';
import { getToken } from '../token.mts';

type ValidationIssue = {
    readonly path: readonly (number | string)[];
};

//Testdaten
const neuerFussballer: FussballerNeuType = {
    nachname: 'Schneider',
    nationalitaet: 'Deutsch',
    position: 'MITTELFELDSPIELER',
    geburtsdatum: new Date('1998-05-12'),
    username: 'schneider98',
    adresse: {
        plz: '70173',
        ort: 'Stuttgart',
        bundesland: 'Baden-Wuerttemberg',
    },
    auszeichnungen: [
        {
            bezeichnung: 'Spieler des Monats',
            saison: '2024/25',
        },
    ],
};

const neuerFussballerInvalid: Record<string, unknown> = {
    nachname: '',
    nationalitaet: '',
    position: 'LIBERO',
    geburtsdatum: 'ungueltiges-datum',
    username: '',
    adresse: {
        plz: '70173',
        ort: 'Stuttgart',
        bundesland: 'Baden-Wuerttemberg',
    },
    auszeichnungen: [
        {
            bezeichnung: 'Spieler des Monats',
            saison: '2024/25',
        },
    ],
};

//Tests
describe('POST /rest', () => {
    let token: string;

    beforeAll(async () => {
        token = await getToken('admin', 'p');
    });

    test('Neuen Fussballer anlegen', async () => {
        // given
        const headers = new Headers();
        headers.set(CONTENT_TYPE, APPLICATION_JSON);
        headers.set(AUTHORIZATION, `${BEARER} ${token}`);

        // whne
        const response = await fetch(restURL, {
            method: POST,
            headers,
            body: JSON.stringify(neuerFussballer),
        });

        // then
        const { status } = response;

        expect(status).toBe(201);

        const location = response.headers.get(LOCATION);

        expect(location).toBeDefined();

        const indexLastSlash = location?.lastIndexOf('/') ?? -1;

        expect(indexLastSlash).not.toBe(-1);

        const idStr = location?.slice(indexLastSlash + 1);

        expect(idStr).toBeDefined();
        expect(FussballerService.ID_PATTERN.test(idStr ?? '')).toBe(true);
    });

    test('Neuen Fussballer mit ungueltigen Daten nicht anlegen', async () => {
        // given
        const headers = new Headers();
        headers.set(CONTENT_TYPE, APPLICATION_JSON);
        headers.set(AUTHORIZATION, `${BEARER} ${token}`);

        const expectedPaths = [
            'nachname',
            'nationalitaet',
            'position',
            'geburtsdatum',
            'username',
        ];

        // when
        const response = await fetch(restURL, {
            method: POST,
            headers,
            body: JSON.stringify(neuerFussballerInvalid),
        });

        // then
        const { status } = response;

        expect(status).toBe(422);

        const body = (await response.json()) as ProblemDetails;
        const validationIssues = body.detail as ValidationIssue[];

        expect(validationIssues).toHaveLength(expectedPaths.length);

        const paths = validationIssues.flatMap(({ path }) => {
            const field = path.at(0);
            return typeof field === 'string' ? [field] : [];
        });

        expect(paths).toStrictEqual(expect.arrayContaining(expectedPaths));
    });
});
