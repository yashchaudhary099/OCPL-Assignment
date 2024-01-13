const mongoose = require("mongoose");

const customersSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  contactNumber: {
    type: Number,
  },
  address: {
    type: String,
    trim: true,
  },
});

const Customers = mongoose.model("Customers", customersSchema);
module.exports = Customers;