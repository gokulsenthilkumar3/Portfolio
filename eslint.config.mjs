import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'

const config = [
  { ignores: ['.next/**', 'dist/**', 'out/**', 'node_modules/**', 'test-results/**', '.vinext/**'] },
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    rules: {
      // Several editor/animation effects intentionally mirror external
      // browser state into React after hydration; this is safe and avoids
      // server/client markup drift.
      'react-hooks/set-state-in-effect': 'off',
    },
  },
]

export default config
