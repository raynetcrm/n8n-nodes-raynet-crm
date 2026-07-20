import { configWithoutCloudSupport } from '@n8n/node-cli/eslint';

// eslint-plugin-n8n-nodes-base is incompatible with ESLint v10 (uses removed context.getFilename()).
// Remove config entries that register the plugin or its rules, but preserve other settings.
const filtered = configWithoutCloudSupport
  .map((entry) => {
    if (!entry.plugins || !('n8n-nodes-base' in entry.plugins)) return entry;
    // Strip the plugin+rules but keep any other settings from this entry
    const { plugins: _p, rules: _r, ...rest } = entry;
    return Object.keys(rest).length > 0 ? rest : null;
  })
  .filter((entry) => {
    if (entry === null) return false;
    if (entry.rules && Object.keys(entry.rules).some((r) => r.startsWith('n8n-nodes-base/'))) return false;
    return true;
  });

export default [
  ...filtered,
  {
    // import-x/no-unresolved produces false positives for .ts paths when the TS resolver
    // is not directly available at the project root. TypeScript itself validates these imports
    // (npm run build is the authoritative check).
    rules: {
      'import-x/no-unresolved': 'off',
    },
  },
];
