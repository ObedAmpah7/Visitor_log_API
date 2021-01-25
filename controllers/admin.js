const qrcode = require('qrcode');

const Visitor = require('../models/visitor');
const Admin = require('../models/admin');
const Employee = require('../models/Employee');
const { findByIdAndDelete } = require('../models/admin');

exports.getVisitors = (req,res,next) => {
    Visitor.find()
    .then(visitors =>{
        res.send(visitors);
    })
};

exports.getEmployees = (req,res,next) => {
    Employee.find()
    .then(employee =>{
        res.send(employee);
    })
};

exports.deleteEmployee = (req, res, next) => {
    const ID = req.params.id
    Employee.findByIdAndDelete(ID) 
    .then(employee => {
        if (employee){
        console.log(result);
        res.send('Employee deleted');
        } else {
            res.send('Employee Not In Database');
        }
    })
    .catch(err => {
        console.log(err);
    })
}

exports.deleteAdmin = (req, res, next) => {
    const ID = req.params.id
    Admin.findByIdAndDelete(ID) 
    .then(admin => {
        if (admin){
        console.log(admin);
        res.send('Admin deleted');
        } else {
            res.send('Admin Not In Database');
        }
    })
    .catch(err => {
        console.log(err);
    })
}

exports.editAdmin = (req, res, next) =>{
    const adminID = req.params.id;
    const updatedEmail = req.body.email;
    const updatedName = req.body.name;
    const updatedPhoneNumber = req.body.phoneNumber;

    Admin.findById(adminID)
    .then(admin =>{
        admin.email = updatedEmail;
        admin.name = updatedName;
        admin.phoneNumber = updatedPhoneNumber;
        admin.save();
    })
    .then(
        res.send('Admin Updated')
        )
    .catch(err =>{
        console.log(err);
    })
}

exports.editEmployee = (req, res, next) =>{
    const employeeID = req.params.id;
    const updatedEmail = req.body.email;
    const updatedName = req.body.name;
    const updatedPhoneNumber = req.body.phoneNumber;
    const updatedDepartment = req.body.department 

    Employee.findById(employeeID)
    .then(employee =>{
        employee.email = updatedEmail;
        employee.name = updatedName;
        employee.phoneNumber = updatedPhoneNumber;
        employee.department = updatedDepartment;
        employee.save();
    })
    .then(
        res.send('Admin Updated')
        )
    .catch(err =>{
        console.log(err);
    })
}