# webinterface

The official webinterface for Naproche.
To update the Naproche component, update 'naproche-community/web-naproche'
and then copy 'frontend-result/bin/frontend.jsexe/all.js' to 'public/naproche-unminified.js' and run
```
uglifyjs naproche-unminified.js -c -o naproche.js
```

To update the prover, compile it with emscripten and update the 'public/prover.js' file.

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

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
