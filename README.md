# address-book
JS frontend for department address book.

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Environment variables
Vue-cli supports [auto-overriding .env files](https://cli.vuejs.org/guide/mode-and-env.html). Make a copy of the default env vars and override them locally for development.
```
cp .env .env.development.local
vim .env.development.local
npm run serve
```

- `VUE_APP_BASE_URL`: base URL of application assets.
- `VUE_APP_IT_ASSETS_URL`: base URL for IT Assets.
- `VUE_APP_KMI_URL`: base URL for KMI.
- `VUE_APP_HIDE_ORG`: renders application without Organisation tab (default  `false`).
