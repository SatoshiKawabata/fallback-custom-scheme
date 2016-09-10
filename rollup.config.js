import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import npm from 'rollup-plugin-node-resolve';

export default {
  entry: 'src/index.js',
  dest: 'build/bundle.js',
  format: 'umd',
  moduleName: 'FallbackCustomScheme',
  plugins: [
    npm({ jsnext: true }),
    commonjs(),
    babel(),
  ],
};
