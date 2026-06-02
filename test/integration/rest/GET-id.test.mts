// oxlint-disable no-magic-numbers

import {
    ACCEPT,
    APPLICATION_JSON,
    CONTENT_TYPE,
    restURL,
} from '../constants.mts';
import { describe, expect, test } from 'vitest';

//testdaten
const ids = [20, 30];
const idNichtVorhanden = 9999;

//Tests
describe('GET /rest/:id', () => {
    test.concurrent.each(ids)(
        'Fussballer mit vorhandener ID %d abrufen',
        async (id) => {
            // given
            const url = `${restURL}/${id}`;
            const requestHeaders = new Headers();
            requestHeaders.append(ACCEPT, APPLICATION_JSON);

            // when
            const response = await fetch(url, { headers: requestHeaders });
            const { status, headers } = response;

            // then
            expect(status).toBe(200);
            expect(headers.get(CONTENT_TYPE)).toMatch(/json/iu);

            const fussballer = (await response.json()) as { id: number };
            expect(fussballer.id).toBe(id);
        },
    );

    test.concurrent('Unbekannte Fussballer-ID liefert Not Found', async () => {
        // given
        const url = `${restURL}/${idNichtVorhanden}`;
        const requestHeaders = new Headers();
        requestHeaders.append(ACCEPT, APPLICATION_JSON);

        // when
        const { status } = await fetch(url, { headers: requestHeaders });

        // then
        expect(status).toBe(404);
    });
});
