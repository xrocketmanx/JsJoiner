var path = require('path');
var fs = require('fs');

module.exports = function(dir, config) {
	dir = dir || config.dir;
	var configPath = path.join(dir, config.userConfig);
	return JSON.parse(fs.readFileSync(configPath));
};