var is = require('../../utils/type-checks/isType');

var methodlist = require('./ValidatorMethodList');

function ValidatorMethods (methodname) {

	return (ValidatorMethods = function (methodname) {

		var realMethodName = this.extractMethodName(methodName);
		return methodlist[realMethodName];

	})(methodname);

}

ValidatorMethods.prototype = {

	extractMethodName: function (methodname) {
		return is.Object(methodname) ? Object.keys(methodname)[0] : methodname;
	}

};