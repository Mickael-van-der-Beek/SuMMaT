var fs = require('fs')
  , httpServerConfig = require('../configuration/http_server-config')
  , env = process.env.NODE_ENV
  , port = process.env.PORT || httpServerConfig.port
  , express = require('express')
  , server = express()
  , httpServer = require('http').createServer(server);

var base_path = 'public';
var base_html = 'index.html';
var envPaths = {
	'development': 'dev',
	'production': 'dist'
};

function main () {
	var ExpressLogger = require('../mods/logging/ExpressTokens')(express);
	var ExpressLogger = require('../mods/logging/ExpressLogger');

	var staticPath = __dirname + '/../' + base_path + '/' + envPaths[env];

	server.configure(function () {
		// Don't show errors explicitly on screen
		server.set('showStackError', false);
		// Standard Express request logger
		server.use(express.logger(ExpressLogger));
		// server.use(express.logger({
		// 	write: ExpressLogger
		// }));
		// Express's Request parser
		server.use(express.bodyParser());
		// Adds support for HTTP PUT and DELETE methods
		server.use(express.methodOverride());
		// Express's GZIP implementation
		server.use(express.compress());
		// Express's Cookie parser
		server.use(express.cookieParser());
		// Specifies which favicon to load
		server.use(express.favicon(/* SPECIFY PATH TO FAVICON HERE */));
		// Use static file if no controllers were able to respond to the request
		server.use(express.static(staticPath));
		// Makes Express use the specified controllers instead of serving static files
		server.use(server.router);
		// Default router
		server.use('', function (req, res) {
			fs.createReadStream(staticPath + '/' + base_html).pipe(res);
		});
	});

	httpServer.listen(port);
	print('green', 'Express.js HTTP server listening on port ' + port + '.');
}

module.exports = main;