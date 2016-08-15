var minifier = require('harp-minify');
var FileManager = require('./file-manager');
var config = require('../config');

function JsFileManager() {
	FileManager.apply(this, arguments);
}
JsFileManager.inherit(FileManager);

JsFileManager.prototype.joinFiles = function(files, minify) {
    var buf = "";
    for (var i = 0; i < files.length; i++) { 
        buf += fs.readFileSync(getPath(files[i]));
    }
    this.writeResult(config.resultFileName, minify ? minifier.js(buf) : buf);
}.delay(100);

function getIgnoredFiles() {
    var ignoreFilePath = getPath(config.ignoreFileName);
    var ignored = [config.resultFileName];

    if (fs.existsSync(ignoreFilePath)) {
        var userIgnored = JSON.parse(fs.readFileSync(ignoreFilePath));
        ignored.concat(userIgnored);
    }
	    
    return ignored;
}