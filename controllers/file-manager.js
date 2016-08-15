var fs = require('fs');
var path = require('path');

function FileManager(dir, ignoredFiles) {
	this.dir = dir;
	this.ignoredFiles = ignoredFiles;
}

FileManager.prototype.watch = function(callback) {
	fs.watch(this.dir, callback);
};

FileManager.prototype.getWatchedFiles = function() {
	var self = this;
	return fs.readdirSync(this.dir).filter(function(file) {
	    return self.isWatchFile(file);
	});
};

FileManager.prototype.isWatchFile = function(file) {
    return file.indexOf(".js") === file.length - 3 && 
        this.ignoredFiles.indexOf(file) === -1;
};

FileManager.prototype.writeResult = function(resultFileName, result) {
	fs.writeFileSync(this.dir + resultFileName, result);
};

FileManager.prototype.getPath = function(file) { 
	return path.join(this.dir, file); 
};

module.exports = FileManager;