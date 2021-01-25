const QRcode = require('qrcode');
const express = require('express');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const nodemailer = require('nodemailer');

const Visitor = require('../models/visitor');

const transporter = nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key:'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'
    }
}))

exports.postVisitorSignIn = (req, res, next) => {
    
    let name = req.body.name;
    let email = req.body.email;
    let phoneNumber = req.body.phoneNumber;
    let purpose = req.body.purpose;
    let hostID = req.body.hostID;

        Visitor.findOne({email: email})
        .then(guest => {
            if (guest){
                guest.email = email;
                guest.name = name;
                guest.phoneNumber = phoneNumber;
                guest.purpose = purpose;
                guest.signedInAt = new Date();
                guest.hostID = hostID;
                guest.save();
               return res.send('user identified');
            }
            const body = req.body
            QRcode.toDataURL(`${JSON.stringify(body)}`, function (err, url) {  
        const visitor = new Visitor({
            
            email: email,
            purpose: purpose,
            name: name,
            phoneNumber: phoneNumber,
            signedInAt: new Date().toString(),
            qrcode : url,
            hostID: hostID
          });
          transporter.sendMail({
            to: email,
            from: 'obedampah17@gmail.com',
            subject: 'Welcome To Amalitech',
            html: `<h1>Hello ${name},
            You have been registered into the Amalitech Visitor Log System. 
            Kindly find the attachment which is your visitors QR code</h1>`,
            attachments: [
                {   // use URL as an attachment
                    filename: `${name}.png`,
                    path: visitor.qrcode
                }
        ]
          });
          return visitor.save();
        })
    })
      .then(result => {
        return res.send('Welcome Visitor');
      })
         .catch (err => {
          console.log(err);
        })
};

exports.postVisitorSignOut = (req, res, next) => {
    const email = req.body.email;
    Visitor.findOne({email:email})
    .then( visitor => {
        if (visitor) {
            visitor.signedOutAt = new Date();
            visitor.save();
        }
    })
    .then (result => {
        return res.send('Signed Out');
    })
    .catch ( err => {
        console.log(err);
    })
};