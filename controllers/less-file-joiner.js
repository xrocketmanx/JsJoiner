var less = require('less');
var fs = require('fs');
var FileJoiner = require('./file-joiner');

function LessFileJoiner() {
	FileJoiner.apply(this, arguments);
}
LessFileJoiner.inherit(FileJoiner);

LessFileJoiner.prototype.joinFiles = function(minify, callback) {
	var self = this;
	var sourceFile = fs.readFileSync(this.getPath(this.config.sourceFileName));
	less.render(sourceFile.toString(), {
		paths: [this.dir],
		compress: minify
	}, function(error, output) {
		if (error) {
			console.log("Less error: " + error.message);
		} else {
			callback(output.css);
		}
	});
};

module.exports = LessFileJoiner;
