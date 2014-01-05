/*!
* Thanks to Joe <http://stackoverflow.com/users/1048572/bergi> for this snippet !
* Link to the question :
* http://stackoverflow.com/questions/19098797/fastest-way-to-flatten-un-flatten-nested-json-objects
*/

var is = require('../type-checks/isType');

function jsonUnflatten (json) {
	if(Object(data) !== data || is.Array(data)) {
		return data;
	}
	var regex = /\.?([^.\[\]]+)|\[(\d+)\]/g
	  , resultholder = {};
	for(var key in data) {
		var cur = resultholder,
			prop = '',
			m;
		while(m = regex.exec(key)) {
			cur = cur[prop] || (cur[prop] = (m[2] ? [] : {}));
			prop = m[2] || m[1];
		}
		cur[prop] = data[key];
	}
	return resultholder[''] || resultholder;
}

module.exports = jsonUnflatten;