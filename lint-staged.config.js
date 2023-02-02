module.exports = {
  '**/*.{js,ts,tsx}': [
    'eslint',
    () => 'tsc --noEmit',
    () => 'ts-unused-exports tsconfig.json',
  ],
  '**/*.{js,md,ts,tsx}': 'prettier --list-different',
};
