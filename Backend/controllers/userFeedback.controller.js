const UserFeedBack = require('../models/userFeedBackSchema');

const createUserFeedBack = async (req, res, next) => {
    try {
        const userId = req.user.userId;

        const feedBack = await UserFeedBack.findOneAndUpdate(
            { userId },
            { $set: req.body },
            { new: true, upsert: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: '✅ Feedback saved successfully',
            data: feedBack
        })
    } catch (err) {
        next(err);
    }
}

const getMyFeedBack = async (req, res, next) => {
    try {
        const userId = req.user.userId;

        const myFeedback = await UserFeedBack.findOne({ userId });

        if (!myFeedback) {
            return res.status(404).json({
                success: false,
                message: 'Feedback not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Feedback fetched successfully',
            data: myFeedback
        })
    } catch (err) {
        next(err);
    }
}

const deleteMyFeedBack = async (req, res, next) => {
    try {
        const userId = req.user.userId;

        const deleteFeedback = await UserFeedBack.findOneAndDelete({ userId });

        if (!deleteFeedback) {
            return res.status(404).json({
                success: false,
                message: 'Feedback not found'
            })
        }

        res.status(204).send();
    } catch (err) {
        next(err);
    }
}

module.exports = { createUserFeedBack, getMyFeedBack, deleteMyFeedBack };