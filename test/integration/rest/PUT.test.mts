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
