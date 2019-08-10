const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  email: {type: String, required: true},
  password: {type: String, required: true},
  datosFiscales: Object,
  facturas: Array
})

const User = mongoose.model("User", userSchema);
module.exports = User;