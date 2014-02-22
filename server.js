var NODE_ENV = process.env.NODE_ENV || 'production';

function InstanciateApplication () {
	// Import the custom global print method for colors and convenience
	require('./utils/print-enhancements/print')();

	// Add easy getter / setters for extracting ingo from Error stacktraces
	require('./utils/prototypes/error-info')();

	// Launch the cluster module and start forking the applications
	var cluster = require('cluster');

	if(cluster.isMaster) {

		if(NODE_ENV === 'development') {
			/*!
			* Script that launches the MongoDB daemon when developping on
			* the localhost environnement.
			*/
			require('./libs/mongodb/mongo-node')([
				'--dbpath ./database/data/db',
				'--nohttpinterface',
				'--notablescan',
				'--noscripting'
			]);
		}

		var systemConfig = require('./configuration/system-config')
		  , maxForkCountConfig = systemConfig.maxForkCount
		  , cpuCount = require('os').cpus().length
		  , maxForkCount = (maxForkCountConfig === 'inherit') ? cpuCount : maxForkCountConfig || 1;

		for(var i = 0; i < maxForkCount; i++) {
			cluster.fork();
		}

		cluster.on('exit', function (worker) {
			cluster.fork();
		});

	}
	else {

		/*!
		* Adds a single event handler / emitter on the whole application so that
		* external modules can listen on this event emitter loaded at startup time.
		* Each module that makes use of this notification centre will listen on a namespace.
		* e.g:
		*		NotificationCentre.on(namespace:event, ...)
		*/
		global.NotificationCentre = require('./mods/notification_centre/NotificationCentre');

		require('./mods/error_handler/ErrorLogger')();

		NotificationCentre.on('startup:database', function () {
			// Setup the database ODM (Mongoose for MongoDB) and import the  schemas and models
			require('./database/setup_ODM')(function () {
				NotificationCentre.emit('startup:http-server');
			});
		});

		NotificationCentre.on('startup:http-server', function () {
			// Setup the HTTP server (Express.js) and import the controllers
			require('./http-server/setup_HTTPServer')(function () {

			});
		});

		NotificationCentre.emit('startup:database');

	}
}

/*!
* Little hack used to import the application environnement inside the testing
* framework, otherwise it will just start the app as usual. 
*/
if(NODE_ENV === 'testing') {
	module.exports = InstanciateApplication;
}
else {
	InstanciateApplication();
}
