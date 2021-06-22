// rollup.config.js
import resolve from '@rollup/plugin-node-resolve';

export default {
  input: 'index.mjs',
  output: {
    dir: '.',
    format: 'cjs'
  },
  plugins: [ resolve() ]
};
