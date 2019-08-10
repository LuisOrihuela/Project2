const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const TicketSchema = new Schema({
  estacion: Number,
  empresa: String,
  fecha: String,
  concepto: String,
  cantidad: Number,
  precioUnitario: Number,
  total: Number
})


const Ticket = mongoose.model('Ticket', TicketSchema);
module.exports = Ticket;