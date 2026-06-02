// oxlint-disable max-lines-per-function

import {
    ACCEPT,
    APPLICATION_JSON,
    CONTENT_TYPE,
    restURL,
} from '../constants.mts';
import { describe, expect, test } from 'vitest';
import { type FussballerMitAdresse } from '../../../src/fussballer/service/fussballer-service.mts';
import { type Page } from '../../../src/fussballer/router/page.mts';

//Testdaten
const nachnamen = ['Vollmer', 'Ulm'];
const nachnamenNichtVorhanden = ['Mustermann', 'Niemand'];
const nationalitaeten = ['Angola', 'Irland'];
const nationalitaetenNichtVorhanden = ['Atlantis', 'Nirgends'];
const positionen = ['TORWART', 'VERTEIDIGER'];

//tests
describe('GET /rest', () => {
    test.concurrent('Fussballer-Liste abrufen', async () => {
        // given
        const requestHeaders = new Headers();
        requestHeaders.append(ACCEPT, APPLICATION_JSON);

        // when
        const response = await fetch(restURL, { headers: requestHeaders });
        const { status, headers } = response;

        // then
        expect(status).toBe(200);
        expect(headers.get(CONTENT_TYPE)).toMatch(/json/iu);

        const body = (await response.json()) as Page<FussballerMitAdresse>;

        body.content
            .map((fussballer) => fussballer.id)
            .forEach((id) => {
                expect(id).toBeDefined();
            });
    });

    test.concurrent.each(nachnamen)(
        'Fussballer mit Nachname %s suchen',
        async (nachname) => {
            // given
            const params = new URLSearchParams({ nachname });
            const url = `${restURL}?${params}`;
            const requestHeaders = new Headers();
            requestHeaders.append(ACCEPT, APPLICATION_JSON);

            // when
            const response = await fetch(url, { headers: requestHeaders });
            const { status, headers } = response;

            // then
            expect(status).toBe(200);
            expect(headers.get(CONTENT_TYPE)).toMatch(/json/iu);

            const body = (await response.json()) as Page<FussballerMitAdresse>;

            expect(body).toBeDefined();

            body.content
                .map((fussballer) => fussballer.nachname)
                .forEach((wert) => {
                    expect(wert).toBe(nachname);
                });
        },
    );

    test.concurrent.each(nachnamenNichtVorhanden)(
        'Keine Fussballer mit Nachname %s finden',
        async (nachname) => {
            // given
            const params = new URLSearchParams({ nachname });
            const url = `${restURL}?${params}`;
            const requestHeaders = new Headers();
            requestHeaders.append(ACCEPT, APPLICATION_JSON);

            // when
            const { status } = await fetch(url, { headers: requestHeaders });

            // then
            expect(status).toBe(404);
        },
    );

    test.concurrent.each(nationalitaeten)(
        'Fussballer mit Nationalitaet %s suchen',
        async (nationalitaet) => {
            // given
            const params = new URLSearchParams({ nationalitaet });
            const url = `${restURL}?${params}`;
            const requestHeaders = new Headers();
            requestHeaders.append(ACCEPT, APPLICATION_JSON);

            // when
            const response = await fetch(url, { headers: requestHeaders });
            const { status, headers } = response;

            // then
            expect(status).toBe(200);
            expect(headers.get(CONTENT_TYPE)).toMatch(/json/iu);

            const body = (await response.json()) as Page<FussballerMitAdresse>;

            expect(body).toBeDefined();

            body.content
                .map((fussballer) => fussballer.nationalitaet)
                .forEach((wert) => {
                    expect(wert).toBe(nationalitaet);
                });
        },
    );

    test.concurrent.each(nationalitaetenNichtVorhanden)(
        'Keine Fussballer mit Nationalitaet %s finden',
        async (nationalitaet) => {
            // given
            const params = new URLSearchParams({ nationalitaet });
            const url = `${restURL}?${params}`;
            const requestHeaders = new Headers();
            requestHeaders.append(ACCEPT, APPLICATION_JSON);

            // when
            const { status } = await fetch(url, { headers: requestHeaders });

            // then
            expect(status).toBe(404);
        },
    );

    test.concurrent.each(positionen)(
        'Fussballer mit Position %s suchen',
        async (position) => {
            // given
            const params = new URLSearchParams({ position });
            const url = `${restURL}?${params}`;
            const requestHeaders = new Headers();
            requestHeaders.append(ACCEPT, APPLICATION_JSON);

            // when
            const response = await fetch(url, { headers: requestHeaders });
            const { status, headers } = response;

            // then
            expect(status).toBe(200);
            expect(headers.get(CONTENT_TYPE)).toMatch(/json/iu);

            const body = (await response.json()) as Page<FussballerMitAdresse>;

            expect(body).toBeDefined();

            body.content
                .map((fussballer) => fussballer.position)
                .forEach((wert) => {
                    expect(wert).toBe(position);
                });
        },
    );

    test.concurrent('Keine Fussballer zu unbekanntem Suchparameter', async () => {
        // given
        const params = new URLSearchParams({ foo: 'bar' });
        const url = `${restURL}?${params}`;
        const requestHeaders = new Headers();
        requestHeaders.append(ACCEPT, APPLICATION_JSON);

        // when
        const { status } = await fetch(url, { headers: requestHeaders });

        // then
        expect(status).toBe(404);
    });
});
