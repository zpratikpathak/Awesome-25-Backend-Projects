exports.errorHandler = (err, req, res, next) => {
	const status = err.status === 400 || err.status === 413 ? err.status : 500;
	res.status(status).json({ error: status === 500 ? 'Internal server error' : 'Invalid request body' });
};