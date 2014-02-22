var mongoose = require('mongoose');

var databaseConfig = require('../configuration/database-config')
  , appdbConfig = databaseConfig.application
  , logdbConfig = databaseConfig.logging;

var MongooseErrorHook = require('../mods/error_handler/MongooseErrorHook');

function set_Globals (appdb, logdb) {
	global.appdb = appdb;
	global.logdb = logdb;
	global.models = appdb.models;
	global.Model = mongoose.Model;
	global.Schema = mongoose.Schema;
	global.ObjectId = Schema.Types.ObjectId;
}

function set_ErrorHandler () {
	appdb.connection.on('error', MongooseErrorHook);
}

function set_Models () {
	var models_path = './models';
	fs.readdirSync(models_path).forEach(function (file) {
		require('./models/' + file);
	});
}

function on_IndexesReady (callback) {
	var modelnames = Object.keys(models)
	  , counter = 0
	  , i = len = modelnames.length
	  , modelname;
	function after_Indexing (error) {
		counter = conter + 1;
		if(error) {
			MongooseErrorHook(error);
		}
		else if(counter === len) {
			print('green', 'Done indexing.');
			callback();
		}
	}
	if(len) {
		while(len--) {
			modelname = modelnames[i];
			model[modelname].on('error', MongooseErrorHook);
			model[modelname].on('index', after_Indexing);
		}
	}
	else {
		callback();
	}
}

function set_ConnectionHandler (callback) {

	appdb.connection.on('connecting', function (error) {
		print('green', error || 'Connecting to ' + hostname + '\'s MongoDB daemon on port ' + port + ' ...');
	});
	appdb.connection.on('connected', function (error) {
		print('green', error || 'Connected to MongoDB successfully.');
	});
	appdb.connection.on('open', function (error) {
		print('green', error || 'Opened connection to MongoDB successfully.');
		on_IndexesReady(callback);
	});
	appdb.connection.on('disconnecting', function (error) {
		print('yellow', error || 'Disconnecting from MongoDB ...');
	});
	appdb.connection.on('disconnected', function (error) {
		print('yellow', error || 'Disconnected from MongoDB successfully.');
	});
	appdb.connection.on('close', function (error) {
		print('yellow', error || 'Closed connection to MongoDB successfully.');
	});
	appdb.connection.on('reconnected', function (error) {
		print('green', error || 'Reconnected to MongoDB successfully.');
	});

}

function main (callback) {
	var appdb = mongoose.createConnection('mongodb://' + appdb.hostname + ':' + appdb.port + '/' + appdb.dbname, {
		user: appdb.user || null,
		pass: appdb.password || null
	});

	var logdb = mongoose.createConnection('mongodb://' + logdb.hostname + ':' + logdb.port + '/' + logdb.dbname, {
		user: logdb.user || null,
		pass: logdb.password || null
	});

	set_Globals(appdb, logdb);
	set_ErrorHandler();
	set_Models();
	set_ConnectionHandler(callback);
}

module.exports = main;