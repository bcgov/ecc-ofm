# frontend

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

With NPM:

```sh
npm install
```

With Yarn:

```sh
yarn
```

### Compile and Hot-Reload for Development

With NPM:

```sh
npm run dev
```

With Yarn:

```sh
yarn dev
```

### Compile and Minify for Production

With NPM:

```sh
npm run build
```

With Yarn:

```sh
yarn build
```

### Lint with [ESLint](https://eslint.org/)

With NPM:

```sh
npm run lint
```

With Yarn:

```sh
yarn lint
```

### Docker

#### Build

```
docker build . -t ofm-frontend
```

#### Run

```
docker run -d -p 80:2015 ofm-frontend
```

#### Verify

Open http://localhost to verify that the app is running.
