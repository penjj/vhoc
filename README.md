<p align="center">
  <img width="300" src="https://raw.githubusercontent.com/penjj/design/main/vhoc/vhoc.png" />
</p>

<h2 align="center">
  Create higher order vue3 components.
</h2>

Documentation: https://penjj.github.io/vhoc/

Playground: https://stackblitz.com/edit/vitejs-vite-jqkxzj?file=src/App.vue

## Install

```bash
pnpm i vhoc -S
```

## Usage

<!-- eslint-skip -->

```ts
import { withProps } from 'vhoc'

const MyInput = withProps(Input)({
  placeholder: 'Please enter.'
})

<MyInput /> // <Input placeholder="Please enter." />
<MyInput placeholder="Hello world." /> // <Input placeholder="Hello world." />
```

## With unplugin-auto-import

<!-- eslint-skip -->

```ts
// vite.config.js
import { VhocImports } from "vhoc/imports";

export default defineConfig({
  plugins: [
    AutoImport({
      imports: [VhocImports()],
    }),
  ],
});
```
