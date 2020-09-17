const express = require('express');

const app = express();

app.use(require('./usuarioRoute'));

app.use(require('./loginRoute'));



module.exports = app;