/* eslint-disable import/no-extraneous-dependencies */
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import nodeResolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import sourceMaps from 'rollup-plugin-sourcemaps';
import uglify from 'rollup-plugin-uglify';

const env = process.env.NODE_ENV;

const shared = {
  entry: `src/index.js`,
  sourceMap: true,
  external: ['react'],
  globals: {
    react: 'React',
  },
  exports: 'named',
};

export default [
  Object.assign({}, shared, {
    moduleName: 'ThemeProvider',
    output: {
      format: 'umd',
      file:
        env === 'production'
          ? './dist/themeProvider.umd.min.js'
          : './dist/themeProvider.umd.js',
    },
    plugins: [
      nodeResolve(),
      babel({
        exclude: '**/node_modules/**',
      }),
      replace({
        'process.env.NODE_ENV': JSON.stringify(env),
      }),
      commonjs({
        ignoreGlobal: true,
      }),
      sourceMaps(),
      env === 'production' && uglify(),
    ],
  }),

  Object.assign({}, shared, {
    output: [
      { file: 'dist/themeProvider.es.js', format: 'es' },
      { file: 'dist/themeProvider.js', format: 'cjs' },
    ],
    plugins: [
      nodeResolve(),
      babel({
        exclude: '**/node_modules/**',
      }),
      commonjs({
        ignoreGlobal: true,
      }),
      sourceMaps(),
    ],
  }),
];