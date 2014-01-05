module.exports = function (express) {

	express.logger.token('req-length', function (req) {
		return req.socket && req.socket.bytesRead && req.socket.bytesRead || '-';
	});

};
