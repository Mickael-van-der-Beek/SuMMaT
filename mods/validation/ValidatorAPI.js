var Validator = require('./Validator');

function ValidatorAPI (app) {

	var cache = {};

	return (ValidatorSchemaCache = function (schema, url) {

		if(!(cache[url] instanceof ValidatorSchema)) {
			return cache[url];
		}
		else {
			return (cache[url] = new ValidatorSchema(schema));
		}

	});

}

module.exports = ValidatorAPI;