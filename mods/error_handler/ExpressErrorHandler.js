

module.exports = function (app) {

	app.use(function (error, req, res, next) {
		next();
	});

};