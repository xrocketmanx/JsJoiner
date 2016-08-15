var path = require('path');
var fs = require('fs');
var config = require('./config');

module.exports = function(dir) {
	dir = dir || config.dir;
	var configPath = path.join(dir, config.userConfig);
	return JSON.parse(fs.readFileSync(configPath));
};