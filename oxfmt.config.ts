import { defineConfig } from 'oxfmt';

// oxlint-disable-next-line import/no-default-export
export default defineConfig({
    singleQuote: true,
    trailingComma: 'all',
    overrides: [
        {
            files: ['*.toml', '*.yml', '*.yaml'],
            options: {
                singleQuote: false,
            },
        },
    ],
    ignorePatterns: [
        '*.md',
        'src/config/resources/postgresql/*.sql',
        'src/config/resources/tls/*.crt',
        'src/config/resources/tls/*.pem',
    ],
});
