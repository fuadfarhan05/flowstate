const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({ 
  googleid: { 
    required: false, 
    type: String,
  }, 
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
    required: false,
    type: String,
    minLength: 8,
  },
});

module.exports = mongoose.model("usermodel", UserSchema);
