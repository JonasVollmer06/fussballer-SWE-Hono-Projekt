// oxlint-disable max-lines-per-function
// oxlint-disable no-magic-numbers

import {
    ACCEPT,
    APPLICATION_JSON,
    CONTENT_TYPE,
    IF_NONE_MATCH,
    restURL,
} from '../constants.mts';
import { describe, expect, test } from 'vitest';

//testdaten
const ids = [20, 30];
const idNichtVorhanden = 9999;
const idsETag = [40, 50];
const idFalsch = 'xyz';

//Tests
