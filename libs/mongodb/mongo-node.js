var NodeShell = require('../../utils/node-shell/shell-commands');

var kill_previous = 'ps -elfc | grep mongod | awk \'{print $2}\' | xargs kill -15';
var base_path = __dirname + '/mongodb';
var version = '2.4.8';
var paths = {
	// 'linux': 'linux_x86_64/bin/phantomjs',
	// 'windows': 'windows/phantomjs.exe',
	'mac': 'osx-x86_64' + '-' + version + '/bin/mongod'
};

function run_MongoCommand (ospath, cmd_args) {
	var fullpath = kill_previous + ' && ' + base_path + '-' + ospath;
	var command = fullpath + ' ' + cmd_args.join(' ');
	NodeShell.run(command, true);
}

function main (cmd_args) {
	var os = process.platform;
	var ospath = paths['linux'];
	if(os.match(/darwin/gi)) ospath = paths['mac'];
	if(os.match(/^win/gi)) ospath = paths['windows'];
	print('green', 'Launched MongoDB daemon if not already existing.');
	run_MongoCommand(ospath, cmd_args);
}

module.exports = main;