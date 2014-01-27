var is = require('../type-checks/isType')
  , env = process.env.NODE_ENV
  , util = require('util');

var colors = {
	red		: '\u001b[31m',
	blue	: '\u001b[34m',
	reset	: '\u001b[0m\n',
	green	: '\x1B[32m- '
};

function print () {
	var message = [];
	var color = arguments[0] instanceof Error ? colors.red : '';
	var hasColorArg = (arguments.length > 1) && is.String(arguments[0]);
	if(!env || (env === 'debug')) {
		message.push('Script : ' + __script);
		message.push('\nMethod : ' + __function + '()');
		message.push('\nLine : ' + __line);
	}
	if(hasColorArg) {
		color = color.length ? color : (colors[arguments[0].toLowerCase()] || '');
	}
	var reset = color.length ? colors.reset : '';
	var content = Array.apply(null, arguments).splice(hasColorArg);
	message = message.concat(color, content, reset);
	console.log.apply(this, message);
}

function deprecateConsole () {
	var message = 'Sorry, console is deprecated, please use print() instead.';
	console.log = util.deprecate(console.log, message);
	console.dir = util.deprecate(console.dir, message);
	console.warn = util.deprecate(console.warn, message);
	console.info = util.deprecate(console.info, message);
	console.error = util.deprecate(console.error, message);
}

function main () {
	global.print = print;
	deprecateConsole();
}

module.exports = main;