require('./config/config');

const express = require('express');
const app = express();

const bodyParser = require('body-parser');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())



app.get('/usuario', function(req, res) {
    res.json('getUsuario');
});

app.post('/usuario', function(req, res) {

    let body = req.body;

    if (body.nombre === undefined) {

        res.status(400).json({

            ok: false,
            msj: "El nombre de usuario es requerido"
        })

    } else {

        res.json({
            Persona: body
        });

    }


});

app.put('/usuario/:id', function(req, res) {

    let id = req.params.id;

    res.json({
        id,
        nombre: "putUsuario"
    })
});

app.delete('/usuario', function(req, res) {
    res.json('deleteUsuario')
});


app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto:', process.env.PORT);
})