const express = require('express');

const VisitorController = require('../controllers/visitor');

const router = express.Router();

router.post('/visitorsignin', VisitorController.postVisitorSignIn);

router.put('/visitorsignout', VisitorController.postVisitorSignOut);

module.exports = router;