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

function set_Models () {
	var models_path = './models';
	fs.readdirSync(models_path).forEach(function (file) {
		require('./models/' + file);
	});
}

function on_IndexesReady (callback) {
	var modelnames = Object.keys(models)
	  , counter = 0
	  , modelname;

	function after_Indexing (error) {
		counter = conter + 1;
		if(error) {
			set_ErrorHandler(error);
		}
		else if(counter === len) {
			print('green', 'Done indexing.');
			callback();
		}
	}

	for(var i = 0, len = modelnames.length; i < len; i++) {
		modelname = modelnames[i];
		model[modelname].on('error', MongooseErrorHook);
		model[modelname].on('index', after_Indexing);		
	}

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

function set_ErrorHandler (error, type) {
	MongooseErrorHook(error, type);
}

function set_ConnectionHandler (db, callback) {

	db.connection.on('error', function (error) {
		set_ErrorHandler(error, 'connection');
	});

	db.connection.on('connecting', function (error) {
		if(error) {
			return set_ErrorHandler(error, 'connecting');
		}
		print('green', 'Connecting to ' + hostname + '\'s MongoDB daemon on port ' + port + ' ...');
	});

	db.connection.on('connected', function (error) {
		if(error) {
			return set_ErrorHandler(error, 'connected');
		}
		print('green', 'Connected to MongoDB successfully.');
	});

	db.connection.on('open', function (error) {
		if(error) {
			return set_ErrorHandler(error, 'open');
		}
		print('green', 'Opened connection to MongoDB successfully.');
		on_IndexesReady(callback);
	});

	db.connection.on('disconnecting', function (error) {
		if(error) {
			return set_ErrorHandler(error, 'disconnecting');
		}
		print('yellow', 'Disconnecting from MongoDB ...');
	});

	db.connection.on('disconnected', function (error) {
		if(error) {
			return set_ErrorHandler(error, 'disconnected');
		}
		print('yellow', 'Disconnected from MongoDB successfully.');
	});

	db.connection.on('close', function (error) {
		if(error) {
			return set_ErrorHandler(error, 'close');
		}
		print('yellow', 'Closed connection to MongoDB successfully.');
	});

	db.connection.on('reconnected', function (error) {
		if(error) {
			return set_ErrorHandler(error, 'reconnected');
		}
		print('green', 'Reconnected to MongoDB successfully.');
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