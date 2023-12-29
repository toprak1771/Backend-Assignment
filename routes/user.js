const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();


router.post('/',userController.registerUser);
router.post('/login',userController.loginUser);

module.exports = router;
