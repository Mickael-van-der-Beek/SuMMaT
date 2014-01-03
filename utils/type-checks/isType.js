exports.Function = function (obj) {
	return Object.prototype.toString.call(obj) === '[object Function]';
};

exports.Object = function (obj) {
	return Object.prototype.toString.call(obj) === '[object Object]';
};

exports.Boolean = function (obj) {
	return Object.prototype.toString.call(obj) === '[object Boolean]';
};

exports.Array = function (obj) {
	return Object.prototype.toString.call(obj) === '[object Array]';
};

exports.String = function (obj) {
	return Object.prototype.toString.call(obj) === '[object String]';
};

exports.Number = function (obj) {
	return Object.prototype.toString.call(obj) === '[object Number]';
};

exports.Date = function (obj) {
	return Object.prototype.toString.call(obj) === '[object Date]';
};

exports.RegExp = function (obj) {
	return Object.prototype.toString.call(obj) === '[object RegExp]';
};