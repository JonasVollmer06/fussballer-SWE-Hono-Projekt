#!/usr/bin/env node

// Aufruf:      npm i --package-lock-only --legacy-peer-deps
//              cd scripts
//              node dependency-check.mts
//              cd ..
//              Remove-Item package-lock.json
//
// ggf. z.B.    bun why hono

import { exec } from 'node:child_process';
import { platform } from 'node:os';
import { resolve } from 'node:path';

const nvdApiKey = 'b65ac691-ced0-4d21-94bd-4bef87c49f1c';
const project = 'fussballer';

let rootDir;
let baseScript = 'dependency-check';

// https://nodejs.org/api/os.html#osplatform
const betriebssystem = platform(); // win32, linux, ...
if (betriebssystem === 'win32') {
    rootDir = resolve('C:/');
    baseScript += '.bat';
} else {
    rootDir = resolve('/');
}
const script = resolve(
    rootDir,
    'Zimmermann',
    'dependency-check',
    'bin',
    baseScript,
);
console.log(`script=${script}`);

const dataPath = resolve(rootDir, 'Zimmermann', 'dependency-check-data');
const reportPath = '.';

const options = `--nvdApiKey ${nvdApiKey} --project ${project} `.concat(
    `--scan .. --suppression dependency-check-suppression.xml `,
    `--out ${reportPath} --data ${dataPath} `,
    // https://jeremylong.github.io/DependencyCheck/dependency-check-cli/arguments.html
    // dependency-check.bat --advancedHelp
    '--nodeAuditSkipDevDependencies ',
    '--nodePackageSkipDevDependencies ',
    '--disableArchive ',
    '--disableAssembly ',
    '--disableAutoconf ',
    '--disableBundleAudit ',
    '--disableCarthageAnalyzer ',
    '--disableCentral ',
    '--disableCentralCache ',
    '--disableCmake ',
    '--disableCocoapodsAnalyzer ',
    '--disableComposer ',
    '--disableCpan ',
    '--disableDart ',
    '--disableGolangDep ',
    '--disableGolangMod ',
    '--disableJar ',
    '--disableMavenInstall ',
    '--disableMSBuild ',
    '--disableNugetconf ',
    '--disableNuspec ',
    '--disableOssIndex ',
    '--disablePip ',
    '--disablePipfile ',
    '--disablePoetry ',
    '--disablePyDist ',
    '--disablePyPkg ',
    '--disableRubygems ',
    '--disableSwiftPackageManagerAnalyzer ',
    '--disableSwiftPackageResolvedAnalyzer ',
    '--disableYarnAudit',
);
console.log(`options=${options}`);
console.log('');

// https://nodejs.org/api/child_process.html#spawning-bat-and-cmd-files-on-windows
// oxlint-disable-next-line promise/prefer-await-to-callbacks
exec(`${script} ${options}`, (err, stdout) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log(stdout);
});
