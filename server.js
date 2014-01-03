// Import the custom global print method for colors and convenience
require('./utils/print-enhancements/print')();

// Script that launches the MongoDB daemon
require('./libs/mongodb/mongo-node')([
	'--dbpath ./database/data/db',
	'--nohttpinterface',
	'--notablescan',
	'--noscripting'
]);

// Launch the cluster module and start forking the applications
var cluster = require('cluster');

if(cluster.isMaster) {

	var systemConfig = require('./configuration/system-config')
	  , maxForkCountConfig = systemConfig.maxForkCount
	  , cpuCount = require('os').cpus().length
	  , maxForkCount = (maxForkCountConfig === 'inherit') ? cpuCount : maxForkCountConfig;

	for(var i = 0; i < maxForkCount; i++) {
		cluster.fork();
	}

	cluster.on('exit', function (worker) {
		cluster.fork();
	});

}
else {

	// Add easy getter / setters for extracting ingo from Error stacktraces
	require('./utils/prototypes/error-info')();

	// Setup the HTTP server (Express.js)
	require('./http-server/setup_HTTPServer')();

	// Setup the database ODM (Mongoose for MongoDB)
	require('./database/setup_ODM')(function () {

		// The following code is run after all indexes are created

	});

}