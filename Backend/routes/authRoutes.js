const express = require('express');
const router = express.Router();
const { forgotPassword, resetPassword } = require('../controllers/authController');
const { validateForgotPassword, validateResetPassword } = require('../middlewares/validateAuth');

router.post('/forgot-password', validateForgotPassword, forgotPassword);
router.post('/reset-password', validateResetPassword, resetPassword);

module.exports = router;