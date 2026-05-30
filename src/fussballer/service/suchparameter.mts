/**
 * Hier haben wir ein Modul bestehend aus Typdefinitionen für die Queryparamter-Suche von Fussballern
 * @packageDocumentation
 */

import { type PositionType } from '../../generated/prisma/enums.ts';

export type Suchparameter = {
    readonly nachname ?: string;
    readonly nationalitaet ?: string;
    readonly position?: PositionType;

};

export const suchparameterNamen = [
    'nachname',
    'nationalitaet',
    'position',
];