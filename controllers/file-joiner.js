var fs = require('fs');
var path = require('path');
var chokidar = require('chokidar');

function FileJoiner(dir, config) {
	this.dir = dir;
	this.config = config;
	this.ignoredFiles = this.getIgnoredFiles(); 

	//delay not to produce many joins at once
	this.joinWrapper = this.joinWrapper.delay(100);
}

FileJoiner.prototype.scan = function(watch, minify) {
	var self = this;
	this.watcher = chokidar.watch(this.dir, {
		ignoreInitial: true,
		ignored: function(file) {
			return !(self.isWatchFile(file) || self.isDirectory(file));
		}
	});

	this.watcher.on('ready', function() {
		self.joinWrapper(minify);
		if (watch) {
			console.log('watching...');
			self.watch(minify);
		} else {
			console.log('end...');
			self.watcher.close();
		}
	});
};

var events = ['add', 'change', 'unlink'];
FileJoiner.prototype.watch = function(minify) {
	var self = this;
	this.watcher.on('all', function(event) {
		if (events.contains(event)) {
			self.joinWrapper(minify);
		}
	});
};

FileJoiner.prototype.joinFiles = function(minify, callback) {
	//abstract
};

FileJoiner.prototype.joinWrapper = function(minify) {
	var self = this;
	var result = this.joinFiles(minify, function(result) {
		self.writeResult(result);
	});
};

FileJoiner.prototype.writeResult = function(result) {
	fs.writeFileSync(this.getPath(this.config.resultFileName), result);
};

FileJoiner.prototype.getWatchedFiles = function(dir) {
	return this.watcher.getWatched();
};

FileJoiner.prototype.isWatchFile = function(file) {
	var regstr = '\\.' + this.config.ext + '$';
    return new RegExp(regstr).test(file) && 
    	!this.ignoredFiles.contains(file);
};

FileJoiner.prototype.isDirectory = function(file) {
	try {
		var stat = fs.statSync(file);
		return stat.isDirectory();
	} catch(error) {
		return true;
	}
}

FileJoiner.prototype.getIgnoredFiles = function(config) {
	if (!this.config.ignoreFileName) return [];
    
    var ignoreFilePath = this.getPath(this.config.ignoreFileName);
    var ignored = [this.config.resultFileName];

    if (fs.existsSync(ignoreFilePath)) {
        var userIgnored = JSON.parse(fs.readFileSync(ignoreFilePath));
        ignored.concat(userIgnored);
    }
    return ignored;
};

FileJoiner.prototype.getPath = function(file) {
	return path.join(this.dir, file);
};

module.exports = FileJoiner;