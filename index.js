var argv = require('minimist')(process.argv.slice(2));
var config = require('./config');
var FileManager = require('./file-manager');
require('./utils');

var dir = argv._[0] || config.dir;
var fileManager = new FileManager(dir);
var files = fileManager.getWatchedFiles();

fileManager.joinFiles(files, argv['min']);
if (!argv['watch']) return;

fileManager.watch(function(event, file) {
	if (event === "rename" || event == "delete") {
    	files.remove(file);
	} else if (event === "change") {
    	if (files.indexOf(file) >= 0) {
        	fileManager.joinFiles(files, argv['min']);
    	} else if (fileManager.isWatchFile(file)) {
        	files.push(file);
    	}
    }  
});