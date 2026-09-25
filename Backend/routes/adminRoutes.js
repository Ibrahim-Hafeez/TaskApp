const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const { makeAdmin } = require('../controllers/adminController');

router.post('/admin/make-admin', authMiddleware, adminMiddleware, makeAdmin);

module.exports = router;