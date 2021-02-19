const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const employeeSchema = new Schema ({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    department: {
        type:String,
        required: true
    },
    password: {
        type: String,
        required:true
    },
    resetToken: String,
    resetTokenExpration: Date
})

module.exports = mongoose.model('Employee', employeeSchema);