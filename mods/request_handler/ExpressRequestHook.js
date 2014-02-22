var WinstonLogger = require('./WinstonLogger')
  , env = process.env.NODE_ENV;

function ExpressRequestLogger (tokens, req, res) {

	console.log('Is "json" : ' + req.is('json'));
	console.log('Is "application/json" : ' + req.is('application/json'));
	console.log('Is "application/javascript" : ' + req.is('application/javascript'));

	if(env === 'development') {
		return print(
			tokens.method(req, res) +
			' ' +
			tokens['response-time'](req, res) +
			' ms ' +
			req.path +
			' ' +
			tokens.status(req, res)
		);
	}

	if(req.is('json') || req.is('application/json') || req.is('application/javascript')) {
		var request = {
			ip_addr			:	req.ips.length ? req.ips : req.ip,
			url				:	req.path,
			req_protocol	:	req.protocol,
			http_method		:	tokens.method(req, res),
			http_refferer	:	tokens.referrer(req, res),
			http_status		:	tokens.status(req, res),
			user			:	req.user && req.user._id || undefined,
			user_agent		:	tokens['user-agent'](req, res),
			req_length		:	tokens['req-length'](req, res),
			response_time	:	tokens['response-time'](req, res)
		};

		var cookies;
		if((cookies = Object.keys(req.cookies)).length) {
			request.cookies = cookies;
		}

		if(req.path.startWith('/auth')) {
			request.req_body = Object.keys(req.body).length ? req.body : undefined;
		}

		WinstonLogger.requests(request);
	}

}

module.exports = ExpressRequestLogger;