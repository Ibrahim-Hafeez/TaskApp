const Task = require('../models/taskSchema');
const mongoose = require('mongoose');

const createTask = async (req, res, next) => {
    try {
        const userId = req.user.userId;

        const { title, description, priority, dueDate } = req.body;

        const newTask = await Task.create({
            userId,
            title,
            description,
            priority,
            dueDate
        });

        res.status(201).json({
            success: true,
            message: 'Task added',
            data: newTask
        })
    } catch (err) {
        next(err);
    }
}

const getMyTasks = async(req, res, next) => {
    try {
        const userId = req.user.userId;

        const filter = { userId };

        const { completed, priority, dueBefore, dueAfter, overdue } = req.query;

        if (completed !== undefined) {
            filter.completed = completed === 'true';
        }

        if (priority) {
            filter.priority = priority;
        }

        if (dueBefore || dueAfter) {
            filter.dueDate = {};

            if (dueBefore) {
                filter.dueDate.$lte = new Date(dueBefore);
            }

            if (dueAfter) {
                filter.dueDate.$gte = new Date(dueAfter);
            }
        }

        if (overdue === 'true') {
            filter.completed = false;
            filter.dueDate = { $lt: new Date() };
        }

        const tasks = await Task.find(filter).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: tasks.length === 0 ? 'No tasks found' : 'Tasks retrieved successfully',
            data: tasks
        });
    } catch (err) {
        next(err);
    }
}

const getMyTask = async (req, res, next) => {
    try {
        const userId = req.user.userId;

        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid task id'
            });
        }

        const task = await Task.findOne({ _id: id, userId });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Task retrieved',
            data: task
        })
    } catch (err) {
        next(err);
    }
}

const updateMyTask = async (req, res, next) => {
    try {
        const userId = req.user.userId;

        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid task id'
            })
        }

        const updateData = { ...req.body };

        if ('completed' in req.body) {
            updateData.completedAt = req.body.completed ? new Date() : null;
        }

        const updatedTask = await Task.findOneAndUpdate(
            { _id: id, userId }, 
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ 
                success: false,
                message: 'Task not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Task updated',
            data: updatedTask
        })
    } catch (err) {
        next(err);
    }
}

const deleteMyTask = async (req, res, next) => {
    try {
        const userId = req.user.userId;

        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid task id'
            });
        }

        const deletedTask = await Task.findOneAndDelete({ _id: id, userId });

        if (!deletedTask) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            })
        }

        res.status(204).send();
    } catch (err) {
        next(err);
    }
}

module.exports = { createTask, getMyTasks, getMyTask, updateMyTask, deleteMyTask };