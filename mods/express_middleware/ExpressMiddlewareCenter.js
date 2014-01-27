var util = require('util');

function ExpressMiddlewareCenter (app, loggerMiddleware, validationMiddleware) {

	thid.middlewares = [];

	this.logger = loggerMiddleware;

	this.validation = validationMiddleware;

	app.GET = this.wrap(app.get);
	app.get = deprecateExpressMethod(app.get);

	app.POST = this.wrap(app.post);
	app.post = deprecateExpressMethod(app.post);

	app.PUT = this.wrap(app.put);
	app.put = deprecateExpressMethod(app.put);

	app.DELETE = this.wrap(app.delete);
	app.delete = deprecateExpressMethod(app.delete);

}

ExpressMiddlewareCenter.prototype.wrap = function (method) {

	var self = this;

	return function (uri, inputValidation, options, outputValidation, callback) {
		var args = [uri, self.logger, self.validation(inputValidation)].concat(this.middlewares);
		method.apply(this, args);
	};

};

ExpressMiddlewareCenter.prototype.plugin = function (middleware) {
	this.middlewares.push(middleware);
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