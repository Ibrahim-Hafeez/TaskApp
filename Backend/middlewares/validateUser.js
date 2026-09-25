const Joi = require('joi');

const validateSignup = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().required().lowercase().trim().email(
            { tlds: { allow: false } }
        ),
        password: Joi.string().min(6).required()
    })
    .required()
    .unknown(false);

    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message
        })
    }

    next();
} 

const validateLogin = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().required().lowercase().trim().email(),
        password: Joi.string().required()
    })
    .required()
    .unknown(false);

    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message
        })
    }

    next();
}

module.exports = { validateSignup, validateLogin };