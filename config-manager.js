var path = require('path');
var fs = require('fs');

module.exports = function(dir, config) {
	dir = dir || config.dir;
	var configPath = path.join(dir, config.userConfig);
	var userConfig = JSON.parse(fs.readFileSync(configPath));
	for (var key in userConfig) {
		userConfig[key].map(function(el) {
			return path.join(dir, el);
		});
	}
	return userConfig;
};