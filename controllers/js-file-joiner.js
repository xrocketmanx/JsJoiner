var minifier = require('harp-minify');
var fs = require('fs');
var FileJoiner = require('./file-joiner');

function JsFileJoiner() {
	FileJoiner.apply(this, arguments);
	this.ignoredFiles = this.getIgnoredFiles();
	this.files = this.getWatchedFiles(this.dir);
}
JsFileJoiner.inherit(FileJoiner);

JsFileJoiner.prototype.joinFiles = function(minify) {
    var buf = "";
    for (var i = 0; i < this.files.length; i++) { 
        buf += fs.readFileSync(this.getPath(this.files[i]));
    }
    this.writeResult(minify ? minifier.js(buf) : buf);
}.delay(100);

JsFileJoiner.prototype.isWatchFile = function(file) {
	return this.super.isWatchFile.call(this, file) &&
		this.ignoredFiles.indexOf(file) === -1;
};

JsFileJoiner.prototype.getIgnoredFiles = function(config) {
    var ignoreFilePath = this.getPath(this.config.ignoreFileName);
    var ignored = [this.config.resultFileName];

    if (fs.existsSync(ignoreFilePath)) {
        var userIgnored = JSON.parse(fs.readFileSync(ignoreFilePath));
        ignored.concat(userIgnored);
    }
    return ignored;
}

module.exports = JsFileJoiner;