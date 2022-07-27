import typescript from '@rollup/plugin-typescript'
import pkg from './package.json'
export default {
  input: './src/index.ts',
  output: [
    {
      //1.cjs
      format: 'cjs',
      file: pkg.main,
    },
    {
      //2.esm
      format: 'esm',
      file: pkg.module,
    },
  ],
  //yarn add @rollup/plugin-typescript -D
  plugins: [typescript()],
}
