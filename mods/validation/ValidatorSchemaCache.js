var flattenJSON = require('../utils/json-tools/json-flatten');

var ValidatorSchema = require('./ValidatorSchema');

function ValidatorSchemaCache () {

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

module.exports = ValidatorSchemaCache;