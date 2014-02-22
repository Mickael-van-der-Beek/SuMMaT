
function ExpressTokens (express) {

	express.logger.token('req-length', function (req) {
		return req.socket && req.socket.bytesRead && req.socket.bytesRead || '-';
	});

}

module.exports = ExpressTokens;