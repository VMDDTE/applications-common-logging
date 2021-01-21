import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import external from 'rollup-plugin-peer-deps-external';
import pkg from './package.json';

export default [
  {
    external: {
      ...pkg.peerDependencies,
      ...pkg.dependencies,
    },
    input: 'src/index.ts',
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: pkg.module,
        format: 'es',
        sourcemap: true,
      },
    ],
    plugins: [
      json(),
      external(),
      babel({
        babelHelpers: 'bundled',
        extensions: ['.js', '.ts'],
      }),
      resolve({
        extensions: ['.json', '.ts'],
      }),
      commonjs(),
    ],
  },
];
