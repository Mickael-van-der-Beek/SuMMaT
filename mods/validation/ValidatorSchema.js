var flattenJSON = require('../utils/json-tools/json-flatten');

var ValidatorMethods = require('./ValidatorMethods');
var is = require('../../utils/type-checks/isType');

function ValidatorSchema (schema) {

	this.schema = flattenJSON(schema);

	this.keys = Object.keys(this.schema);

}

ValidatorSchema.prototype = {

	next: function () {
		return this.keys.pop();
	},

	validateField: function (fieldname, value) {

		var validationMethods = fieldname[value];
		var method;
		var error;
		for(var i = 0, len = validationMethods.length; i < len; i++) {
			method = validationMethods[i];
			if((error = new ValidatorMethods(method)(value))) {
				break;
			}
		}

		return error;

	}

};

module.exports = ValidatorSchema;