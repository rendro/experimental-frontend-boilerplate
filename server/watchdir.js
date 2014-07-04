var fs       = require('fs');
var watch    = require('node-watch');
var path     = require('path');
var Observer = require('./observer.js');

var isDir = function(f) {
	return fs.statSync(f).isDirectory();
};

var isNotDotDir = function(f) {
	return f !== '.' && f !== '..';
};

var prependPath = function(basePath) {
	return function(f) {
		return path.join(basePath, f);
	};
};

var recursiveFindFiles = function(basePath, pattern) {
	var result = [];

	if (basePath.match(pattern)) {
		return [basePath];
	}

	if (isDir(basePath)) {
		fs.readdirSync(basePath)
			.filter(isNotDotDir)
			.map(prependPath(basePath))
			.forEach(function(f) {
				result = result.concat(recursiveFindFiles(f, pattern));
			});
	}

	return result;
};

var WatchDir = function(basePath, pattern) {
	Observer.call(this);

	this.basePath = basePath;
	this.pattern = pattern;

	// add initial files
	recursiveFindFiles(this.basePath, this.pattern).forEach(this.addFile.bind(this));

	// watch changes
	watch(this.basePath, this.onWatchEvent);
};

WatchDir.prototype = Object.create(Observer.prototype);

WatchDir.prototype.lastChanges = {};

WatchDir.prototype.addFile = function(file) {
	var stats = fs.statSync(file);
	this.lastChanges[file] = stats.mtime;
	console.log('[WatchDir] WATCHING: ' + path.relative(process.cwd(), file));
	this.emit('watch', file);
};

WatchDir.prototype.onWatchEvent = function(file) {
	// does not match the file pattern
	if (!file.match(this.pattern)) {
		return;
	}

	// deleted if file does not exist any more
	if (!fs.existsSync(file)) {
		console.log('[WatchDir] DELETED: ' + path.relative(process.cwd(), file));
		this.emit('delete', file);
	} else {
		// edited or added
		var stats = fs.statSync(file);
		if (this.lastChanges[file]) {
			if (this.lastChanges[file] < stats.mtime) {
				this.lastChanges[file] = stats.mtime;
				console.log('[WatchDir] CHANGED: ' + path.relative(process.cwd(), file));
				this.emit('change', file);
			}
		} else {
			this.lastChanges[file] = stats.mtime;
			console.log('[WatchDir] ADDED: ' + path.relative(process.cwd(), file));
			this.emit('add', file);
		}
	}
};

module.exports = WatchDir;
