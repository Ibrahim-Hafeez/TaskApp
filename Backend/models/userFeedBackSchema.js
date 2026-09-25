const mongoose = require('mongoose');

const userFeedBackSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        min: 3
    },
    comment: {
        type: String,
        required: true,
        min: 3
    },
    rating: {
        type: Number,
        required: true,
        min: [1, 'Rating must be at least 1 star'],
        max: [5, 'Rating cannot exceed 5 stars'],
        validate: {
            validator: Number.isInteger,
            message: 'Rating must be an integer'
        }
    }
}, { timestamps: true });

module.exports = mongoose.model('UserFeedBack', userFeedBackSchema);