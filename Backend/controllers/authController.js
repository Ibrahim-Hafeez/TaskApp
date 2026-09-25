const crypto = require('crypto');
const User = require('../models/userSchema');
const PasswordResetToken = require('../models/PasswordResetTokenSchema');
const sendEmail = require('../utils/sendEmail');

const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.json({
                message: 'If the email exists, a reset link has been sent.'
            })
        }

        await PasswordResetToken.deleteMany({ userId: user._id });

        const rawToken = crypto.randomBytes(32).toString('hex');

        const tokenHash = crypto
            .createHash('sha256')
            .update(rawToken)
            .digest('hex');

        await PasswordResetToken.create({
            userId: user._id,
            tokenHash,
            expiresAt: Date.now() + 15 * 60 * 1000
        });

        const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${rawToken}`;

        await sendEmail({
            to: user.email,
            subject: 'Reset your password',
            html: `
                <p>You requested a password reset.</p>
                <p>
                    <a href='${resetLink}'>
                        Click here to reset your password
                    </a>
                </p>
                <p>This link expires in 15 minutes.</p>
            `
        });

        res.json({
            message: 'If the email exists, a reset link has been sent.'
        })
    } catch (err) {
        next(err);
    }
}

const resetPassword = async (req, res, next) => {
    try {
        const { token, newPassword } = req.body;

        const tokenHash = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        const resetToken = await PasswordResetToken.findOne({
            tokenHash,
            expiresAt: { $gt: Date.now() },
            used: false
        });

        if (!resetToken) {
            return res.status(400).json({
                message: 'Reset link is invalid or expired.'
            });
        }

        const user = await User.findById(resetToken.userId).select('+password');

        if (!user) {
            return res.status(400).json({
                message: 'Reset link is invalid or expired.'
            });
        }

        user.password = newPassword;
        await user.save();

        resetToken.used = true;
        await resetToken.save();

        res.json({
            message: 'Password reset successful. You can now log in.'
        });
    } catch (err) {
        next(err);
    }
}

module.exports = { forgotPassword, resetPassword };