const mongoose = require("mongoose");
const User = require("./user");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  access: {
    level: Number,
    group: String,
  },
  address: {
    street: String,
    city: String,
    country: String,
  },
  car: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("User", userSchema);
