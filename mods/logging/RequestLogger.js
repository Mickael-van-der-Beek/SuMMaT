var winston = require('winston')
  , WinstonMongoDb = require('winston-mongodb').MongoDB;

var databaseConfig = require('../../configuration/database-config').logging;

var hostname = databaseConfig.hostname
  , username = databaseConfig.username
  , password = databaseConfig.password
  , dbname = databaseConfig.dbname
  , port = databaseConfig.port;

function RequestLogger () {

	this.logger = new (winston.Logger)({
		transports: [
			new (winston.transports.Console)(),
			new (winston.transports.MongoDB)({
				collection: 'requests',
				username: username,
				password: password,
				errorTimeout: 5000,
				storeHost: false,
				level: 'requests',
				port: port,
				host: hostname,
				db: dbname
			})
		],
		levels: {
			requests: 0
		}
	});

}

var logger = new RequestLogger().logger;

module.exports = logger;