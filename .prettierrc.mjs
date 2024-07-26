// prettier.config.js, .prettierrc.js, prettier.config.mjs, or .prettierrc.mjs

/** @type {import("prettier").Config} */
const config = {
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  printWidth: 120,
  trailingComma: 'es5',
  endOfLine: 'auto',
  overrides: [
    {
      files: ['*.mdx', '*.md'],
      options: {
        printWidth: 80,
        proseWrap: 'always',
      },
    },
  ],
};

export default config;
