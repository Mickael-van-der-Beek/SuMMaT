
function ExpressErrorHook (error, req, res, next) {

	NotificationCentre.emit('logging:error', {
		type: 'express:' + (req.path || '*'),
		stack: error.stack || new Error().stack
	});

	next();

}

module.exports = ExpressErrorHook;