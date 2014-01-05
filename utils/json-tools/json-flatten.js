/*!
* Thanks to Joe <http://stackoverflow.com/users/1048572/bergi> for this snippet !
* Link to the question :
* http://stackoverflow.com/questions/19098797/fastest-way-to-flatten-un-flatten-nested-json-objects
*/

var is = require('../utils/type-checks/isType');

function jsonFlatten (json) {
	var result = {};
	function inspectJSON (obj, prop) {
		if(Object(obj) !== obj) {
			result[prop] = obj;
		}
		else if(is.Array(obj)) {
			for(var i = 0, len = obj.length; i < len; i++) {
				inspectJSON(obj[i], prop ? prop + '.' + i : '' + i);
			}
			if(len === 0) {
				result[prop] = [];
			}
		}
		else {
			var isEmpty = true;
			for(var key in obj) {
				isEmpty = false;
				inspectJSON(obj[key], prop ? prop + '.' + key : key);
			}
			if(isEmpty) {
				result[prop] = {};
			}
		}
	}
	return inspectJSON(json, '') || result;
}

module.exports = jsonFlatten;