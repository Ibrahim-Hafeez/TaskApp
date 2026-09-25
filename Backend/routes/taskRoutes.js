const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { validateCreateTask, validateUpdateTask } = require('../middlewares/validateTask');
const { createTask, getMyTasks, getMyTask, updateMyTask, deleteMyTask } = require('../controllers/taskController');

router.post('/tasks', authMiddleware, validateCreateTask, createTask);
router.get('/tasks', authMiddleware, getMyTasks);
router.get('/tasks/:id', authMiddleware, getMyTask);
router.patch('/tasks/:id', authMiddleware, validateUpdateTask, updateMyTask);
router.delete('/tasks/:id', authMiddleware, deleteMyTask);

module.exports = router;