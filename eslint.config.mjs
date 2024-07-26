import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended';
import eslintPluginReact from 'eslint-plugin-react/configs/recommended.js';

export default tseslint.config(
  // config with just ignores is the replacement for `.eslintignore`
  {
    ignores: ['**/node_modules/**', '**/dist/**', '**/cweb_tool/**', '**/cweb_dist/**', '**/build/**'],
  },

  // rest of the config by module

  // eslint recommended
  {
    ...eslint.configs.recommended,
    languageOptions: {
      globals: {
        process: 'readonly',
        console: 'readonly',
      },
    },
    rules: {
      ...eslint.configs.recommended.rules,
      'no-console': 'warn',
      'no-bitwise': 'error',
    },
  },

  //prettier
  { ...eslintPluginPrettier },
  { ...eslintConfigPrettier },

  // typescript
  ...tseslint.configs.recommendedTypeChecked.map((config) => ({
    ...config,
    files: ['**/*.ts', '**/*.tsx'], // We use TS config only for TS files
  })),
  {
    files: ['**/*.ts', '**/*.tsx'], // We use TS config only for TS files
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: ['tsconfig.eslint.json', './packages/*/tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: false }],
    },
  },

  // react
  {
    ...eslintPluginReact,
    settings: { react: { version: 'detect' } },
    rules: {
      ...eslintPluginReact.rules,
      'react/react-in-jsx-scope': 'off',
    },
  }
);
