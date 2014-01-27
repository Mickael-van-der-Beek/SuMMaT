var Validator = require('./Validator');

function ExpressValidator (req, res, next) {

	var mixin = {};

	/*!
	* Security measure just to make sure the data used is the one
	* we validated previously.
	*/
	protect(req, 'body', mixin);
	protect(req, 'query', mixin);
	protect(req, 'params', mixin);

	Validator

}

function protect (req, key, mixin) {
	mixin[key] = req[key];
	Object.freeze(req[key]);
	Object.defineProperty(req, key, {
		get: function () {
			return mixin[key];
		},
		set: function (value) {
			mixin[key] = value;
		}
	});
}

module.exports = ExpressValidator;