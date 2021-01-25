const bcrypt = require ('bcryptjs');
const jwt = require('jsonwebtoken');
const express = require('express');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const Admin = require('../models/admin');
const Employee = require('../models/Employee');

const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
      api_key:'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'
  }
}));

  exports.postAdminSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const name =req.body.name;
    const phoneNumber = req.body.phoneNumber;
    
    Admin.findOne({ email: email })
      .then(userDoc => {
        if (userDoc) {
          return res.send('error', 'E-Mail exists already, please pick a different one.');
          
        }
        return bcrypt
          .hash(password, 12)
          .then(hashedPassword => {
            const admin = new Admin({
              email: email,
              password: hashedPassword,
              name: name,
              phoneNumber: phoneNumber
            });
            return admin.save();
          })
          .then(result => {
            return res.send('Welcome');
          });
      })
      .catch(err => {
        console.log(err);
      });
  };

  exports.postEmployeeSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const name =req.body.name;
    const phoneNumber = req.body.phoneNumber;
    const department = req.body.department;
    
    Admin.findOne({ email: email })
      .then(userDoc => {
        if (userDoc) {
          return res.send('error', 'E-Mail exists already, please pick a different one.'); 
        }
        return bcrypt
          .hash(password, 12)
          .then(hashedPassword => {
            const employee = new Employee({
              email: email,
              password: hashedPassword,
              name: name,
              phoneNumber: phoneNumber,
              department: department
            });
            return employee.save();
          })
          .then(result => {
            res.send('Employee Created');
            transporter.sendMail({
              to: email,
              from: 'obedampah17@gmail.com',
              subject: 'Registered Into Visiter Log System As Employee',
              html: `<h1>Hello ${name} you have have been register into the visitor's log system</h1>`
            });
          } )
            .catch(err =>{
              console.log(err)  
          });
      })
      .catch(err => {
        console.log(err);
      });
  };

  exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    Admin.findOne({ email: email })
      .then(admin => {
        if (!admin) {
          req.flash('error', 'Invalid email or password.');
          return res.send('/login');
        }
        bcrypt
          .compare(password, admin.password)
          .then(doMatch => {
            if (doMatch) {
              // reqsession.isLoggedIn = true;
              req.session.admin = admin;
              return res.send('Logged In');
            }
            req.flash('error', 'Invalid email or password.');
            res.send('login error');
          })
          .catch(err => {
            console.log(err);
            // res.send('/login');
          });
      })
      .catch(err => console.log(err));
  };

  exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
      console.log(err);
      res.send('Logged Out');
    });
  }