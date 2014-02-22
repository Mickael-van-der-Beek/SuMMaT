var fs = require('fs')
  , httpServerConfig = require('../configuration/http_server-config')
  , env = process.env.NODE_ENV
  , port = process.env.PORT || httpServerConfig.port
  , express = require('express')
  , server = express()
  , httpServer = require('http').createServer(server);

var ExpressMiddlewareCenter = require('../mods/express_middleware/ExpressMiddlewareCenter')
  , ExpressAuthentication = require('../mods/authentication/ExpressAuthentication')
  , ExpressRequestLogger = require('../mods/logging/ExpressRequestLogger')
  , ExpressHTTPSRedirect = require('../mods/security/ExpressHTTPSRedirect')
  , ExpressErrorHook = require('../mods/error_handler/ExpressErrorHook')
  , ExpressValidator = require('../mods/validation/ExpressValidator')
  , ExpressSecurity = require('../mods/security/ExpressSecurity')
  , ExpressTokens = require('../mods/logging/ExpressTokens');

var base_path = 'public';
var base_html = 'index.html';
var envPaths = {
	'development': 'dev',
	'production': 'dist'
};

function set_ConnectionHandler (callback) {
	httpServer.listen(port, function (error) {
		if(error) {
			print('red', error);
		}
		else {
			print('green', 'Express.js HTTP server listening on port ' + port + '.');
		}
		callback();
	});
}

function set_DefaultRoute () {
	server.use(function (req, res, next) {
		if(req.originalUrl.startsWith('/api')) {
			return fs.createReadStream(staticPath + '/' + base_html).pipe(res);
		}
		next();
	});
}

function set_Controllers () {
	var api_controllers_path = './api';
	fs.readdirSync(api_controllers_path).forEach(function (file) {
		require('./api/' + file)(server);
	});

	var auth_controllers_path = './auth';
	fs.readdirSync(auth_controllers_path).forEach(function (file) {
		require('./auth/' + file)(server);
	});
}

function set_EnvConfiguration () {
	app.configure('development', function () {
		// Don't show errors explicitly on screen
		server.set('showStackError', true);
	});

	app.configure('testing', function () {
		// Don't show errors explicitly on screen
		server.set('showStackError', true);
	});

	app.configure('production', function () {
		// Don't show errors explicitly on screen
		server.set('showStackError', false);
		// Custom Express request logger
		server.use(express.logger(ExpressRequestLogger));
	});

	server.configure(function () {
		// Don't show errors explicitly on screen
		app.set('showStackError', false);
		// Remove the "Powered by Express.js" header to save on bandwidth usage
		app.disable('x-powered-by');
		// Express's Request parsers
		app.use(express.json({
			limit: '1mb'
		}));
		app.use(express.urlencoded({
			limit: '1mb'
		}));
		app.use(express.multipart({
			limit: '10mb'
		}));
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
		// Authenticate by default each API call
		server.all('/api*', ExpressAuthentication);
	});
}

function main (callback) {
	var staticPath = __dirname + '/../' + base_path + '/' + envPaths[env];
	server.set('env', env);

	ExpressTokens(express);

	(new ExpressMiddlewareCenter(
		server,
		ExpressValidator,
		ExpressAuthentication,
		ExpressResponse,
		{}
	))
	.plugin(ExpressHTTPSRedirect);

	ExpressSecurity(server);

	set_EnvConfiguration();
	set_Controllers();
	set_DefaultRoute();

	server.use(ExpressErrorHook);

	set_ConnectionHandler(callback);
}

module.exports = main;