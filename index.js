var fs = require('fs');
var argv = require('minimist')(process.argv.slice(2));
var minify = require('harp-minify');
var config = require('./config');
argv['min'] = argv['min'] || config.min;
argv['watch'] = argv['watch'] || config.watch;
var dir = argv._[0] || config.dir;
var ignoredFiles = getIgnoredFiles(dir);
var files = fs.readdirSync(dir).filter(function(file) {
    return isWatchFile(file);
});

joinFiles = delay(joinFiles, 100);

joinFiles(files);
if (!argv['watch']) return;

fs.watch(dir, function(event, file) {
	if (event === "rename" || event == "delete") {
    	files.remove(file);
	} else if (event === "change") {
    	if (files.indexOf(file) >= 0) {
        	joinFiles(files);
    	} else if (isWatchFile(file)) {
        	files.push(file);
    	}
    }  
});

function joinFiles(files) {
    var buf = "";
    for (var i = 0; i < files.length; i++) { 
        buf += fs.readFileSync(getPath(files[i]));
    }

    fs.writeFileSync(dir + config.resultFileName, argv['min'] ? minify.js(buf) : buf);
}

function getIgnoredFiles(dir) {
    var ignorePath = getPath('ignore.json');
    var ignored = ['joined.js', 'jsJoiner.js'];
    if (fs.existsSync(ignorePath)) {
        var userIgnored = JSON.parse(fs.readFileSync(ignorePath));
        ignored.concat(userIgnored);
    }
    return ignored;
}

function isWatchFile(file) {
    return file.indexOf(".js") === file.length - 3 && 
        ignoredFiles.indexOf(file) === -1;
}

function delay(func, ms) {
    var block = false;
    return function() {
        if (block) return;
        block = true;
        func.apply(this, arguments);
        setTimeout(function() {
            block = false;
        }, ms);
    }
}

function getPath(file) { 
	return dir + file; 
}

Array.prototype.remove = function(element) {
	var index = this.indexOf(element);
	if (index === -1) return false;
    for (var i = index; i < this.length - 1; i++) {
    	this[i] = this[i + 1];
    }
    this.length = this.length - 1;
    return true;
}