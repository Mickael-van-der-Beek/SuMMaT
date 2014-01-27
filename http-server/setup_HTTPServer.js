var fs = require('fs')
  , httpServerConfig = require('../configuration/http_server-config')
  , env = process.env.NODE_ENV
  , port = process.env.PORT || httpServerConfig.port
  , express = require('express')
  , server = express()
  , httpServer = require('http').createServer(server);

var ExpressMiddlewareCenter = require('../mods/express_middleware/ExpressMiddlewareCenter')
  , ExpressAuthentication = require('../mods/validation/ExpressAuthentication')
  , ExpressValidator = require('../mods/validation/ExpressValidator')
  , ExpressLogger = require('../mods/logging/ExpressLogger');

var base_path = 'public';
var base_html = 'index.html';
var envPaths = {
	'development': 'dev',
	'production': 'dist'
};

function main (callback) {
	var CustomExpressTokens = require('../mods/logging/ExpressTokens')(express);

	var staticPath = __dirname + '/../' + base_path + '/' + envPaths[env];

	ExpressMiddlewareCenter(server, ExpressLogger, ExpressValidator);

	server.configure(function () {
		// Don't show errors explicitly on screen
		server.set('showStackError', false);
		// Custom Express request logger
		server.use(express.logger(ExpressLogger));
		// Express's Request parser
		server.use(express.bodyParser());
		// TODO - MISSING STREAM LIMITS !!!
		// Adds support for HTTP PUT and DELETE methods
		server.use(express.methodOverride());
		// Express's GZIP implementation
		server.use(express.compress());
		// Express's Cookie parser
		server.use(express.cookieParser());
		// Specifies which favicon to load
		server.use(express.favicon(staticPath + '/' + favicon.ico));
		// Use static file if no controllers were able to respond to the request
		server.use(express.static(staticPath));
		// Makes Express use the specified controllers instead of serving static files
		server.use(server.router);
	});

	server.all('/api*', ExpressAuthentication);

	// Default router, placed as last matching route in case of 404s
	server.use('', function (req, res) {
		fs.createReadStream(staticPath + '/' + base_html).pipe(res);
	});

	httpServer.listen(port, function (error) {
		if(error) {
			print('red', error);
		}
		else {
			print('green', 'Express.js HTTP server listening on port ' + port + '.');
			callback();
		}
	});
}

module.exports = main;