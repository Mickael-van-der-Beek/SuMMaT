var is = require('../type-checks/isType');
var shell = require('child_process').exec;

exports.run = function (command, silent, callback) {
	var child = shell(command, function (error, stdout, stderr) {
		if(error) {
			print('red', error);
		}
		if(is.Function(callback)) {
			callback.call(this, stderr, stdout);
		}
		else if(!silent) {
			if(stdout && stdout.length) {
				print(stdout);
			}
			if(stderr && stderr.length) {
				print('red', stderr);
			}
		}
	});
	child.stdout.on('data', function (data) {
		if(!silent) {
			print('blue', data.toString());
		}
	});
};