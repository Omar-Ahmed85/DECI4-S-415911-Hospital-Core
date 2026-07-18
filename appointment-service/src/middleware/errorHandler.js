function notFound(req, res) {
    res.status(404).json({ message: 'Route not found' });
}

function errorHandler(err, req, res, next) {
    if (res.headersSent) return next(err);

    if (err.name === 'ValidationError') {
        return res.status(400).json({ message: 'Validation failed', errors: [err.message] });
    }
    if (err.name === 'CastError') {
        return res.status(400).json({ message: 'Invalid ID format' });
    }
    if (err.code === 11000) {
        return res.status(409).json({ message: 'Duplicate value not allowed' });
    }

    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ message: err.message || 'Internal server error' });
}

module.exports = { notFound, errorHandler };
