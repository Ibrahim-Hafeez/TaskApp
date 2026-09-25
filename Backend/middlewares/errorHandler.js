const errorHandler = (err, req, res, next) => {
    console.error(err.message);

    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];

        return res.status(409).json({
            success: false,
            message: `${field} already exists`
        });
    }

    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            message: 'Validation error'
        })
    }

    res.status(500).json({
        success: false,
        message: 'Something went wrong'
    });
}

module.exports = errorHandler;