const mongoose = require('mongoose');

const Employee = require('./Employee');

const Schema = mongoose.Schema;

const visitorSchema = new Schema ({
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
    purpose: {
        type: String,
        required:true
    },
    hostID: {
        type: Schema.Types.ObjectId, ref: 'Employee'
    },
    signedInAt: {
        type: String,
        required:true
    },
    signedOutAt: {
        type: String
    },
    qrcode: {
        type: String
    }

})

module.exports = mongoose.model('Visitor', visitorSchema);