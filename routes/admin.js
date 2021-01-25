const express = require('express');

const AuthController = require('../controllers/auth');
const AdminController = require('../controllers/admin');

const router = express.Router();

router.post('/signupadmin', AuthController.postAdminSignup);

router.post('/signupemployee', AuthController.postEmployeeSignup);

router.get('/allvisitors', AdminController.getVisitors);

router.get('/allemployees', AdminController.getEmployees);

router.post('/admin/login', AuthController.postLogin);

router.post('/logout', AuthController.postLogout);

router.delete('/deleteemployee/:id', AdminController.deleteEmployee);

router.delete('/deleteadmin/:id', AdminController.deleteAdmin);

router.put('/updateadmin/:id', AdminController.editAdmin);

router.put('/updateemployee/:id', AdminController.editEmployee);

module.exports = router;