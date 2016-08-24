var minifier = require('harp-minify');
var fs = require('fs');
var path = require('path');
var FileJoiner = require('./file-joiner');

function JsFileJoiner() {
	FileJoiner.apply(this, arguments);
}
JsFileJoiner.inherit(FileJoiner);

JsFileJoiner.prototype.joinFiles = function(minify, callback) {
    var files = this.getWatchedFiles();
    var buf = "";
    for (var dir in files) {
        var dirFiles = files[dir];
        for (var i = 0; i < dirFiles.length; i++) {
            if (this.isWatchFile(dirFiles[i])) {
                buf += fs.readFileSync(path.join(dir, dirFiles[i]));
            }
        } 
    }
    callback(minify ? minifier.js(buf) : buf);
};

module.exports = JsFileJoiner;