const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    // required: true,
  },
  age: {
    type: String,
    required: true,
  },
  sex: {
    type: String,
    // required: true,
  },
  mobileNumber: {
    type: String,
  },
  guardianName: {
    type: String,
  },
  guardianEmail: {
    type: String,
  },
  emergencyNumber: {
    type: String,
  },
  address: {
    type: String,
  },
  country: {
    type: String,
  },
  state: {
    type: String,
  },
  city: {
    type: String,
  },
  pincode: {
    type: String,
  },

  govId: {
    type: String,
    // required: true,
  },
  govtIdValue: {
    type: String,
  },
  nationality: {
    type: String,
    // required: true,
  },
  religion: {
    type: String,
  },
  occupation: {
    type: String,
  },
  bloodGroup: {
    type: String,
  },
  nationality: {
    type: String,
  },
  martailStatus: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
