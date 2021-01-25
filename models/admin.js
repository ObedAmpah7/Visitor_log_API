const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const adminSchema = new Schema({
    name:{
        type: String,
        required: "Name Is Required",
        trim: true
    },
  email: {
    type: String,
    required: "Email Is Required",
    trim: true
  },
  phoneNumber:{
      type: String,
      required: "Number Is Required",
      trim: true
  },
  password: {
    type: String,
    required: "Password Is Required",
    trim: true
  }
    // confirmPassword: {
    //     type: String,
    //     required:true
    // },
  
});

module.exports = mongoose.model('Admin', adminSchema);