const mongoose = require('mongoose');
const { schema } = require('./usuarioModel');

const Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        unique: true,
        required: [true, 'la descripción es obligatoria']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
})


module.exports = mongoose.model('Categoria', categoriaSchema);