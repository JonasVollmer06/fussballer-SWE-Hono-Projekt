import { z } from 'zod';

const NAME_PATTERN = /^[A-ZÄÖÜ][a-zäöüß]+(-[A-ZÄÖÜ][a-zäöüß]+)?$/u;
const PLZ_PATTERN = /^\d{5}$/u;
const SAISON_PATTERN = /^(\d{4})(\/\d{2})?$/u;
const AUSZEICHNUNG_PATTERN =
    /^[A-ZÄÖÜ][A-Za-zÄÖÜäöüß]*(?:[ -][A-ZÄÖÜ][A-Za-zÄÖÜäöüß]*)*$/u;
