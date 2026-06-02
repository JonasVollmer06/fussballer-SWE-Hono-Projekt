import { AUTHORIZATION, BEARER, DELETE, restURL } from '../constants.mts';
import { beforeAll, describe, expect, test } from 'vitest';
import { getToken } from '../token.mts';
// Testdaten
const id = '30';

// Tests

describe('DELETE /rest', () => {
    let token: string;

    beforeAll(async () => {
        token = await getToken('admin', 'p');
    });

    test.concurrent('Gespeichertes Fussballer-Objekt aus DB löschen', async () => {
        // arrange
        const url = `${restURL}/${id}`;
        const headers = new Headers();
        headers.append(AUTHORIZATION, `${BEARER} ${token}`);

        // act
        const { status } = await fetch(url, {
            method: DELETE,
            headers,
        });

        // assert
        expect(status).toBe(204);
    });

    test.concurrent('Fussballer-Objekt mit falschem Token löschen', async () => {
        // arrange
        const url = `${restURL}/${id}`;
        const headers = new Headers();
        headers.append(AUTHORIZATION, `${BEARER} FALSCHER_TOKEN`);

        // act
        const { status } = await fetch(url, {
            method: DELETE,
            headers,
        });

        // assert
        expect(status).toBe(401);
    });
});
