var WinstonLogger = require('./../logging/WinstonLogger')
  , env = process.env.NODE_ENV;

function ErrorLogger () {

	if(env === 'development') {

		print('red', error);

	}
	else {

		NotificationCentre.on('logging:error', function (error) {
			WinstonLogger.errors({
				type: error.type,
				stack: error.stack
			});
		});

	}

}

module.exports = ErrorLogger;