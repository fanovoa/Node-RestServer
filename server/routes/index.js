const express = require('express');

const app = express();

app.use(require('./usuarioRoute'));

app.use(require('./loginRoute'));

app.use(require('./categoriaRoute'));

app.use(require('./productoRoute'));

app.use(require('./uploadRoute'));

app.use(require('./imagenesRoute'));


module.exports = app;