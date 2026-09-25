const Joi = require('joi');

const validateUserFeedBack = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required().trim(),
        comment: Joi.string().required().min(3).trim(),
        rating: Joi.number().integer().required().min(1).max(5).messages({
            'number.base': 'Rating must be a number',
            'number.integer': 'Rating must be an integer',
            'number.min': 'Rating must be at least 1 star',
            'number.max': 'Rating connot exceed 5 stars',
            'any.required': 'Rating is required'
        })
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

module.exports = validateUserFeedBack;