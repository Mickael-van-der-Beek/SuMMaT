var is = require('../../utils/type-checks/isType');
var flattenJSON = require('../utils/json-tools/json-flatten');

function Validator (schema, url) {

	if(schema === undefined || !is.Object(schema)) {
		return new SGError('INVALID_VALIDATION_SCHEMA');
	}
	if(url === undefined || !is.String(url)) {
		return new SGError('INVALID_VALIDATION_URL');
	}

	this.schema = new ValidatorSchemaCache(schema, url);
	this.schema.format();

}

Validator.prototype = {

	existenceError: 'MISSING_VALUE',

	exec: function (url, object, callback) {

		var cachedSchema = this.schema;
		var flatObject = flattenJSON(object);
		var error;
		var val;
		var key;
		while((key = cachedSchema.next())) {
			if(!(key in flatObject) && (error = this.existenceError)) {
				break;
			}
			else {
				val = flatObject[key];
			}
			if((error = cachedSchema.validateField(key, val))) {
				break;
			}
			else {
				mixin[key] = val;
			}
		}

		return error || mixin;

	}

};

module.exports = Validator;