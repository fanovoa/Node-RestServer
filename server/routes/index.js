const express = require('express');

const app = express();

app.use(require('./usuarioRoute'));

app.use(require('./loginRoute'));

app.use(require('./categoriaRoute'));

app.use(require('./productoRoute'));



module.exports = app;