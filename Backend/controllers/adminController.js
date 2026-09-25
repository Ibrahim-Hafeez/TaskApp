const User = require('../models/userSchema');

const makeAdmin = async (req, res, next) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (user.role === 'admin') {
            return res.status(400).json({
                success: false,
                message: 'User is already an admin'
            });
        }

        user.role = 'admin';
        await user.save();

        res.status(200).json({
            success: true,
            message: 'User promoted to admin'
        })
    } catch (err) {
        next(err);
    }
}

module.exports = { makeAdmin };