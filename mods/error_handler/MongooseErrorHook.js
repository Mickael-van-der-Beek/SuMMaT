
function MongooseErrorHook (error, type) {

	NotificationCentre.emit('logging:error', {
		type: 'mongoose:' + (type || this.modelName || '*'),
		stack: error.stack || new Error().stack
	});

}

module.exports = MongooseErrorHook;