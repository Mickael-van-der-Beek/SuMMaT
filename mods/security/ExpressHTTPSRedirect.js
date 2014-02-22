var httpServerConfig = require('../../configuration/http_server-config');

function ExpressHTTPSRedirect (server) {

	app.use(function (req, res, next) {
		if(httpServerConfig.https && req.get('X-Forwarded-Proto') !== 'https') {
			res.redirect('https://' + req.get('Host') + req.url);
		}
		else {
			next();
		}
	});

}

module.exports = ExpressHTTPSRedirect;
