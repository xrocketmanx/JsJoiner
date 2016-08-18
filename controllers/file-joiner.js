var fs = require('fs');
var path = require('path');

function FileJoiner(dir, config) {
	this.dir = dir;
	this.config = config;
	//this.files = this.getWatchedFiles(this.dir); 
}

FileJoiner.prototype.watch = function(minify) {
	var self = this;
	fs.watch(self.dir, function(event, file) {
		if (event === "rename" || event == "delete") {
	    	self.files.remove(file);
		} else if (event === "change") {
	    	if (self.files.indexOf(file) >= 0) {
	        	self.joinFiles(minify);
	    	} else if (self.isWatchFile(file)) {
	        	self.files.push(file);
	    	}
	    }
	});
};

this.joinFiles = function(minify) {
	//abstract
};

FileJoiner.prototype.getWatchedFiles = function(dir) {
	var self = this;
	return fs.readdirSync(dir).filter(function(file) {
	    return self.isWatchFile(file);
	});
};

FileJoiner.prototype.isWatchFile = function(file) {
	//virtual
    return file.indexOf(this.config.ext) === file.length - this.config.ext.length;
};

FileJoiner.prototype.writeResult = function(result) {
	fs.writeFileSync(this.dir + this.config.resultFileName, result);
};

FileJoiner.prototype.getPath = function(file) { 
	return path.join(this.dir, file); 
};

module.exports = FileJoiner;