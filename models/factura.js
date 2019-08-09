const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const FacturaSchema = new Schema({
  estacion: Number,
  empresa: String,
  fecha: String,
  concepto: String,
  cantidad: Number,
  precioUnitario: Number,
  total: Number
})


const factura = mongoose.model('Factura', FacturaSchema);
module.exports = factura;