var helmet = require('helmet');

function ExpressSecurity (server) {

	// XSS protection header
	app.use(helmet.iexss());

	// Cache-Control header which sets the no-cache, no-store properties
	app.use(function (req, res, next) {
		if(req.path.startWith('/auth') || req.path.startWith('/api')) {
			(helmet.cacheControl()).apply(this, arguments);
		}
		else {
			next();
		}
	});

	// Setup Content Policy Security (CSP)
	//app.use(app.use(helmet.csp()));

	// Setup content origin :
	app.use(helmet.xframe('deny'));

	// Prevent download to be opened in IE
	app.use(helmet.ienoopen());

	// Prevent MIME sniffing in IE / Chrome :
	app.use(helmet.contentTypeOptions());

	// Force HTTPS transport
	app.use(helmet.hsts(8640000, true));

}

module.exports = ExpressSecurity;
