const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const usuario = require('./usuario');

const Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        unique: true,
        required: [true, 'El nombre es necesario']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
});
categoriaSchema.plugin(uniqueValidator, {
    message: '{PATH} debe ser único'
});

module.exports = mongoose.model('Categoria', categoriaSchema);