const Joi = require('joi');

const validateCreateTask = (req, res, next) => {
    const schema = Joi.object({
        title: Joi.string().max(100).required().trim(),
        description: Joi.string().max(500).trim(),
        priority: Joi.string().valid('low', 'medium', 'high'),
        dueDate: Joi.date()
    })
    .required()
    .unknown(false);

    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message
        });
    }

    next();
}

const validateUpdateTask = (req, res, next) => {
    const schema = Joi.object({
        title: Joi.string().max(100).trim(),
        description: Joi.string().max(500).trim(),
        priority: Joi.string().valid('low', 'medium', 'high'),
        dueDate: Joi.date(),
        completed: Joi.boolean()
    })
    .min(1)
    .required()
    .unknown(false);

    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message
        });
    }

    next();
}

module.exports = { validateCreateTask, validateUpdateTask };