const Joi = require('joi');

const validateForgotPassword = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required().messages({
            'string.email': 'Invalid email address',
            'any.required': 'Email is required'
        })
    })

    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message
        })
    }

    next();
}

const validateResetPassword = (req, res, next) => {
    const schema = Joi.object({
        token: Joi.string().required().messages({
            'any.required': 'Reset token is required'
        }),
        newPassword: Joi.string().min(6).required().messages({
            'string.min': 'Password must be at least 6 characters',
            'any.required': 'New password is required'
        })
    });

    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message
        });
    }

    next();
}

module.exports = { validateForgotPassword, validateResetPassword };