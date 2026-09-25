const express = require('express');
const router = express.Router();
const validateUserFeedBack = require('../middlewares/validateFeedBack');
const authMiddleware = require('../middlewares/authMiddleware');
const { createUserFeedBack, getMyFeedBack, deleteMyFeedBack } = require('../controllers/userFeedback.controller');

router.post('/feedback', authMiddleware, validateUserFeedBack, createUserFeedBack);
router.get('/feedback', authMiddleware, getMyFeedBack);
router.delete('/feedback', authMiddleware, deleteMyFeedBack);

module.exports = router;