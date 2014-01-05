var RequestLogger = require('./RequestLogger')
  , env = process.env.NODE_ENV;

function ExpressLogger (tokens, req, res) {

	//if(req.is('json') || req.is('application/json') || req.is('application/javascript')) {
		RequestLogger.requests({
			ip_addr			:	req.ips.length ? req.ips : req.ip,
			url				:	req.path,
			req_protocol	:	req.protocol,
			http_method		:	tokens.method(req, res),
			http_refferer	:	tokens.referrer(req, res),
			http_status		:	tokens.status(req, res),
			user			:	req.user && req.user._id || null,
			user_agent		:	tokens['user-agent'](req, res),
			cookies			:	Object.keys(req.cookies).length ? req.cookies : null,
			req_body		:	Object.keys(req.body).length ? req.body : null,
			req_length		:	tokens['req-length'](req, res),
			response_time	:	tokens['response-time'](req, res)
		});
	//}

	if(env === 'development') {
		print(
			tokens.method(req, res) +
			' ' +
			tokens['response-time'](req, res) +
			' ms ' +
			req.path +
			' ' +
			tokens.status(req, res)
		);
	}

}

module.exports = ExpressLogger;