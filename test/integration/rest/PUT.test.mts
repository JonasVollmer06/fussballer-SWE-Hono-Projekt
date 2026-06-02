// oxlint-disable max-lines-per-function

import {
    APPLICATION_JSON,
    AUTHORIZATION,
    BEARER,
    CONTENT_TYPE,
    ETAG,
    IF_MATCH,
    PUT,
    restURL,
} from '../constants.mts';
import { beforeAll, describe, expect, test } from 'vitest';
import { type FussballerUpdateType } from '../../../src/fussballer/router/fussballer-validation.mts';
import { type ProblemDetails } from '../../../src/problem-details.mts';
import { getToken } from '../token.mts';

type ValidationIssue = {
    readonly path: readonly (number | string)[];
}

//Testdaten
const geaenderterFussballer: FussballerUpdateType = {
    nachname: 'Vollmer',
    nationalitaet: 'Deutsch',
    position: 'MITTELFELDSPIELER',
    geburtsdatum: new Date('2005-06-06'),
};
const idVorhanden = 20;

const fussballerFuerNichtVorhandeneId: FussballerUpdateType = {
    nachname: 'Nichtvorhanden',
    nationalitaet: 'Deutsch',
    position: 'STUERMER',
    geburtsdatum: new Date('2000-01-01'),
};
const idNichtVorhanden = 9999;

const fussballerInvalid: Record<string, unknown> = {
    nachname: '',
    nationalitaet: '',
    position: 'LIBERO',
    geburtsdatum: 'ungueltiges-datum',
};

//Tests
describe('PUT /rest/:id', () => {
    let token: string;

    beforeAll(async () => {
        token = await getToken('admin', 'p');
    });

    test('Vorhandenen Fussballer aendern', async () => {
        // given
        const url = `${restURL}/${idVorhanden}`;
        const headers = new Headers();
        headers.set(CONTENT_TYPE, APPLICATION_JSON);
        headers.set(AUTHORIZATION, `${BEARER} ${token}`);
        headers.set(IF_MATCH, '"0"');

        // when
        const response = await fetch(url, {
            method: PUT,
            headers,
            body: JSON.stringify(geaenderterFussballer),
        });

        // then
        const { status } = response;

        expect(status).toBe(204);
        expect(response.headers.get(ETAG)).toBe('"1"');

        const body = await response.text();
        expect(body).toBe('');
    });
})
