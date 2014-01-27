exports.Function = function (obj) {
	return Object.prototype.toString.call(obj) === '[object Function]';
};

exports.Object = function (obj) {
	return (Object.prototype.toString.call(obj) === '[object Object]') && (obj.constructor === Object);
};

exports.Boolean = function (obj) {
	return (obj === true) || (obj === false);
};

exports.Array = function (obj) {
	return Array.isArray(obj);
};

exports.String = function (obj) {
	return Object.prototype.toString.call(obj) === '[object String]';
};

exports.Number = function (obj) {
	return (Object.prototype.toString.call(obj) === '[object Number]') && !isNaN(obj);
};

exports.Int = function (obj) {
	return exports.Number(obj) && ((obj | 0) === obj);
};

exports.Date = function (obj) {
	return (Object.prototype.toString.call(obj) === '[object Date]') && !isNaN(+obj);
};

exports.RegExp = function (obj) {
	return Object.prototype.toString.call(obj) === '[object RegExp]';
};