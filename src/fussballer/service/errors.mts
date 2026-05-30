// oxlint-disable max-classes-per-file

/**
 * Das Modul besteht aus den Klassen für die Fehlerbehanldung bei der Verwaltung von Büchern, z.B. beim DB-Zugriff.
 * @packageDocumentation
 */

/**
 * Error-Klasse für ein nicht gefundenes Fussballer-Objekt
 */
export class NotFoundError extends Error {}

/**
 * Error-Klasse für eine ungültige Versionsnummer beim Ändern.
 */
export class VersionInvalidError extends Error {
    readonly version: string | undefined;

    constructor(version: string | undefined) {
        super(`Die Versionnummer ${version} ist ungueltig.`);
        this.version = version;
    }
}

/**
 * Error-Klasse für fehlerhafte/veraltete Versionsnummer (Update)
 */
export class VersionOutdatedError extends Error {
    readonly version: number;

    constructor(version:number) {
        super(`Die Versionsnummer ${version} ist nicht aktuell.`);
        this.version = version;
    }
}