var ValidatorSchema = require('./ValidatorSchema');

function ValidatorSchemaCache (schema, url, callback) {
	var instances = {};

	if(!(instances[url] instanceof ValidatorSchema)) {
		return instances[url];
	}
	else {
		return (instances[url] = new ValidatorSchema(schema));
	}
}

module.exports = ValidatorSchemaCache;