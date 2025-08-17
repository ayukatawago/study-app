// eslint.config.js
import { FlatCompat } from '@eslint/eslintrc';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Adapt existing config to flat config format
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const config = [
  // Ignores for files that would have been in .eslintignore
  {
    ignores: [
      // Build output
      '.next/**',
      'out/**',
      'build/**',
      'dist/**',
      // Node modules
      'node_modules/**',
      // Type definitions
      '**/*.d.ts',
      // Generated files
      '**/*.generated.*',
      // Other
      '.vscode/**',
    ],
  },

  // Use existing configurations from .eslintrc.json
  ...compat.config({
    extends: ['next/core-web-vitals', 'prettier'],
    plugins: ['prettier'],
    rules: {
      'prettier/prettier': 'error',
      'no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_|^props$|^e$|^err$|^error$',
          varsIgnorePattern: '^_|^props$|^e$|^err$|^error$',
          destructuredArrayIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      'no-console': 'warn',
    },
    overrides: [
      {
        files: ['**/types/*.ts', '**/types/*.tsx', '**/interfaces/*.ts', '**/interfaces/*.tsx'],
        rules: {
          'no-unused-vars': 'off',
        },
      },
      {
        files: ['**/components/**/*.tsx'],
        rules: {
          'no-unused-vars': [
            'warn',
            {
              argsIgnorePattern:
                '^_|^props$|^e$|^err$|^error$|^settings$|^item$|^onCorrect$|^onIncorrect$|^onFlip$|^isFlipped$|^onResetProgress$|^incorrectIds$',
              varsIgnorePattern: '^_|^props$|^e$|^err$|^error$',
              destructuredArrayIgnorePattern: '^_',
              ignoreRestSiblings: true,
            },
          ],
        },
      },
      {
        files: ['**/utils/logger.ts'],
        rules: {
          'no-console': 'off',
        },
      },
    ],
  }),
];

export default config;
