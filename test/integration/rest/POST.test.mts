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
