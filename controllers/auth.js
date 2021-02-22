const bcrypt = require ('bcryptjs');
const jwt = require('jsonwebtoken');
const express = require('express');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const Admin = require('../models/admin');
const Employee = require('../models/Employee');
const { post } = require('../routes/admin');

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
    
    Employee.findOne({ email: email })
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

  exports.postReset = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
      if (err){
        console.log(err);
        return res.send('Reset Error');
      }
      const token = buffer.toString('hex');
      Employee.findOne({email: req.body.email})
      .then(employee => {
        if (!employee) {
          req.flash('error', 'No account found');
          return res.send('Error Check email');
        }
        employee.resetToken = token;
        employee.resetTokenExpration = Date.now() + 3600000;
        return employee.save();
      })
      .then(result => {
        transporter.sendMail({
          to: req.body.email,
          from: 'obedampah17@gmail.com',
          subject: 'Password Reset',
          html: `
          <p> You requested a password reset </p>
          <p> Click this <a href="http://localhost:3000/reset/pass/${token}">link</a> to set a new Password.</p>
          `
        })
        return res.send('password reseted');
      })
    })
  };

  exports.getPasswordReset = (req, res, next) => {
    const newPassword = req.body.password;
    const token = req.params.token;
    let resetEmployee;
    Employee.findOne({resetToken : token, resetTokenExpration : { $gt: Date.now()}
})
.then( employee => {
  console.log(employee);
  resetEmployee = employee;
  return bcrypt.hash(newPassword, 12);
  // res.send(`${employee.name} found for password reset`)
})
.then( hashedPassword => {
  resetEmployee.password = hashedPassword;
  resetEmployee.token = undefined;
  resetEmployee.resetTokenExpration = undefined;
  return resetEmployee.save();
})
.then( result => {
  res.send(`${resetEmployee.name} password reseted`);
})
.catch(err => {
  console.log(err);
});
  };

  // exports.postPasswordReset

