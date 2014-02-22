var util = require('util');

function ExpressMiddlewareCenter (server, validationMiddleware, authMiddleware, responseHandler, options) {

	thid.middlewares = [];

	this.defaultAuth = !!options.defaultAuth;

	this.validator = validationMiddleware || [];

	this.authenticator = authMiddleware || [];

	if(responseHandler) {
		this.responseHandler = responseHandler;
	}

	server.GET = this.wrap(server.get);
	server.get = this.deprecate(server.get);

	server.POST = this.wrap(server.post);
	server.post = this.deprecate(server.post);

	server.PUT = this.wrap(server.put);
	server.put = this.deprecate(server.put);

	server.DELETE = this.wrap(server.delete);
	server.delete = this.deprecate(server.delete);

}

ExpressMiddlewareCenter.prototype.wrap = function (method) {

	var self = this;

	return function (uri, inputValidation, outputValidation, controller, options) {
		var beforeControllerArgs = [
			uri
		]
		.concat(self.validator(inputValidation))
		.concat(self.middlewares);

		var auth = (options.auth !== undefined) ? options.auth : self.defaultAuth;
		if(auth) {
			beforeControllerArgs.push(self.authenticator);
		}

		var afterControllerArgs = [
			self.validator(outputValidation),
		];

		method.apply(
			self,
			[]
			.concat(beforeControllerArgs)
			.concat(controller)
			.concat(afterControllerArgs)
			.concat(self.responseHandler)
		);
	};

};

ExpressMiddlewareCenter.prototype.plugin = function (middleware) {
	this.middlewares.push(middleware);
};

ExpressMiddlewareCenter.prototype.responseHandler = function (req, res) {
	res.send(200);
};

ExpressMiddlewareCenter.prototype.deprecate = function (method) {

	var message = [
		'Sorry, ',
		'app.get, app.post, app.put and app.delete are deprecated. ',
		'Please use app.GET, app.POST, app.PUT or app.DELETE instead.'
	].join('');

	return util.deprecate(method, message);

};

module.exports = ExpressMiddlewareCenter;