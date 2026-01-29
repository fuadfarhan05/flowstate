const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
  },
  email: {
    required: true,
    type: String,
    unique: true,
  },
  password: {
    required: true,
    type: String,
    minLength: 8,
  },
});

module.exports = mongoose.model("usermodel", UserSchema);
