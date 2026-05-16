#!/usr/bin/env node

// Aufruf:   node scripts/asciidoctor.mts

import asciidoctor from '@asciidoctor/core';
import { join } from 'node:path';
// https://github.com/eshepelyuk/asciidoctor-plantuml.js ist deprecated
// @ts-expect-error keine .d.ts-Datei
import kroki from 'asciidoctor-kroki';
import url from 'node:url';

const adoc = asciidoctor();
console.log(`Asciidoctor.js ${adoc.getVersion()}`);

kroki.register(adoc.Extensions);

const options = {
    safe: 'safe',
    attributes: { linkcss: true },
    base_dir: 'extras/doc',
    to_dir: 'html',
    mkdirs: true,
};
adoc.convertFile(join('extras', 'doc', 'projekthandbuch.adoc'), options);

// oxlint-disable-next-line no-underscore-dangle
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
console.log(
    `HTML-Datei ${join(
        __dirname,
        '..',
        'extras',
        'doc',
        'html',
        'projekthandbuch.html',
    )}`,
);
