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
const nationalitaeten = ['Angola', 'Irland'];

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
});
