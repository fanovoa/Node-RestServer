require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

const bodyParser = require('body-parser');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));

//Configuración global de routes
app.use(require('./routes/index'));


const coneccionBD = async() => {

    try {

        let coneccion = await mongoose.connect(process.env.URLBD, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });
        console.log('Base datos ONLINE');
    } catch (err) {
        console.log(err)
    }

}

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto:', process.env.PORT);
    coneccionBD();
})