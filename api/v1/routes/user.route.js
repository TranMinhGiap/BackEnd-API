const express = require("express");
const router = express.Router();

//controller
const controller = require("../controllers/user.controller")

// Middleware
const authMiddleware = require("../middleware/auth.middleware");

router.post('/register', controller.register)
router.post('/login', controller.login)
router.post('/password/forgot', controller.forgotPassword)  
router.post('/password/otp', controller.otpPassword)  
router.post('/password/reset', controller.resetPassword)  
router.get('/info', authMiddleware.requireAuth, controller.info)  
router.get('/list', authMiddleware.requireAuth, controller.list)

module.exports = router;