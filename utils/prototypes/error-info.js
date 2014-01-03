/*!
* Thanks to Joe <http://stackoverflow.com/users/57135/joe> for this snippet !
* Link to the question :
* http://stackoverflow.com/questions/14172455/get-name-and-line-of-calling-function-in-node-js
*/

function set_Stack () {
	Object.defineProperty(global, '__stack', {
		get: function () {
			var origin = Error.prepareStackTrace;
			Error.prepareStackTrace = function (_, stack) {
				return stack;
			};
			var error = new Error();
			Error.captureStackTrace(error, arguments.callee);
			var stack = error.stack;
			Error.prepareStackTrace = origin;
			return stack;
		}
	});
}

function set_Line () {
	Object.defineProperty(global, '__line', {
		get: function () {
			var stack = __stack[2];
			return stack && stack.getLineNumber() || '';
		}
	});
}

function set_Function () {
	Object.defineProperty(global, '__function', {
		get: function () {
			var stack = __stack[2];
			return stack && stack.getFunctionName() || 'anonymous';
		}
	});
}

function set_Script () {
	Object.defineProperty(global, '__script', {
		get: function () {
			var stack = __stack[2];
			return stack && stack.getFileName() || '';
		}
	});
}

function main () {
	set_Stack();
	set_Line();
	set_Function();
	set_Script();
}

module.exports = main;