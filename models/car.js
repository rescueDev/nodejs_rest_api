const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const carSchema = new Schema({
  brand: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  specs: {
    power: String,
    fuel: String,
  },
});

module.exports = mongoose.model("Car", carSchema);
