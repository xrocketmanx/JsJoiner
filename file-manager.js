var fs = require('fs');
var minifier = require('harp-minify');
var config = require('./config');

module.exports = function(dir) {
	var ignoredFiles = getIgnoredFiles();
	var self = this;

	this.watch = function(callback) {
		fs.watch(dir, callback);
	};

	this.getWatchedFiles = function() {
		return fs.readdirSync(dir).filter(function(file) {
		    return self.isWatchFile(file);
		});
	};

	this.joinFiles = function(files, minify) {
	    var buf = "";
	    for (var i = 0; i < files.length; i++) { 
	        buf += fs.readFileSync(getPath(files[i]));
	    }

	    fs.writeFileSync(dir + config.resultFileName, minify ? minifier.js(buf) : buf);
	}.delay(100);

	this.isWatchFile = function(file) {
	    return file.indexOf(".js") === file.length - 3 && 
	        ignoredFiles.indexOf(file) === -1;
	};

	function getIgnoredFiles() {
	    var ignoreFilePath = getPath(config.ignoreFileName);
	    var ignored = [config.resultFileName];

	    if (fs.existsSync(ignoreFilePath)) {
	        var userIgnored = JSON.parse(fs.readFileSync(ignoreFilePath));
	        ignored.concat(userIgnored);
	    }
	    
	    return ignored;
	}

	function getPath(file) { 
		return dir + file; 
	}
}