var less = require('less');
var fs = require('fs');
var FileJoiner = require('./file-joiner');

function LessFileJoiner() {
	FileJoiner.apply(this, arguments);
	this.files = this.getWatchedFiles(this.dir);
}
LessFileJoiner.inherit(FileJoiner);

LessFileJoiner.prototype.joinFiles = function(minify) {
	var self = this;
	var sourceFile = fs.readFileSync(this.getPath(this.config.sourceFileName));
	less.render(sourceFile.toString(), {
		paths: [this.dir],
		compress: minify
	}, function(error, output) {
		if (error) {
			throw error;
		} else {
			self.writeResult(output.css);
		}
	});
}.delay(100);

module.exports = LessFileJoiner;
