var mongoose = require('mongoose');

var databaseConfig = require('../configuration/database-config').application;

var hostname = databaseConfig.hostname
  , port = databaseConfig.port
  , dbname = databaseConfig.dbname
  , user = databaseConfig.user
  , password = databaseConfig.password;

function set_Globals () {
	global.model = mongoose.model.bind(mongoose);
	global.models = mongoose.models;
	global.Model = mongoose.Model;
	global.Schema = mongoose.Schema;
	global.ObjectId = mongoose.Schema.Types.ObjectId;
}

function set_ErrorHandler (mongoose) {
	mongoose.connection.on('error', function (error) {
		if(error) {
			print('red', error);
		}
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
			print('red', error);
		}
		else if(counter === len) {
			print('green', 'Done indexing.');
			callback();
		}
	}
	if(len) {
		while(len--) {
			modelname = modelnames[i];
			model[modelname].on('index', after_Indexing);
		}
	}
	else {
		callback();
	}
}

function set_ConnectionHandler (mongoose, callback) {
	mongoose.connection.on('connecting', function (error) {
		print('green', error || 'Connecting to ' + hostname + '\'s MongoDB daemon on port ' + port + ' ...');
	});
	mongoose.connection.on('connected', function (error) {
		print('green', error || 'Connected to MongoDB successfully.');
	});
	mongoose.connection.on('open', function (error) {
		print('green', error || 'Opened connection to MongoDB successfully.');
		on_IndexesReady(callback);
	});
	mongoose.connection.on('disconnecting', function (error) {
		print('yellow', error || 'Disconnecting from MongoDB ...');
	});
	mongoose.connection.on('disconnected', function (error) {
		print('yellow', error || 'Disconnected from MongoDB successfully.');
	});
	mongoose.connection.on('close', function (error) {
		print('yellow', error || 'Closed connection to MongoDB successfully.');
	});
	mongoose.connection.on('reconnected', function (error) {
		print('green', error || 'Reconnected to MongoDB successfully.');
	});
}

function main (callback) {
	mongoose.connect('mongodb://' + hostname + ':' + port + '/' + dbname, {
		user: user || null,
		pass: password || null
	});
	set_Globals();
	set_ErrorHandler(mongoose);
	set_ConnectionHandler(mongoose, callback);
}

module.exports = main;