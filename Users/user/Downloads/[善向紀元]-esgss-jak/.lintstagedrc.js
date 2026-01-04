module.exports = {
  // TypeScript and JavaScript files
  '**/*.{ts,tsx,js,jsx}': [
    'eslint --fix',
    'prettier --write'
  ],

  // JSON, CSS, and other config files
  '**/*.{json,css,scss,md}': [
    'prettier --write'
  ],

  // TypeScript type checking (only on staged files)
  '**/*.{ts,tsx}': () => 'tsc --noEmit --skipLibCheck',

  // Test files
  '**/*.{test,spec}.{ts,tsx}': [
    'npm run test:run -- --run'
  ]
};