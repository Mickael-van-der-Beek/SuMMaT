var is = require('../type-checks/isType')
  , env = process.env.NODE_ENV;

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
	if(!env || (env === 'development')) {
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

function main () {
	global.print = print;
}

module.exports = main;