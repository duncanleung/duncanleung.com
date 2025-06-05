module.exports = {
  semi: false,
  singleQuote: true,
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  trailingComma: 'es5',
  bracketSpacing: true,
  plugins: ['prettier-plugin-tailwindcss'],
  overrides: [
    {
      files: '*.mdx',
      options: {
        embeddedLanguageFormatting: 'off',
      },
    },
  ],
}
