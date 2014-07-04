var fs       = require('fs');
var path     = require('path');
var Observer = require('../observer.js');
var WatchDir = require('../watchdir.js');

var Middleware = function(config) {
	Observer.call(this);

	this.config = config;
	this.watcher = new WatchDir(path.dirname(this.config.src), this.filePattern);
	this.watcher.on('add change delete', this.compile.bind(this));
};

Middleware.prototype = Object.create(Observer.prototype);

Middleware.prototype.compiledSource = '';

Middleware.prototype.filePattern = /./;

Middleware.prototype.contentType = 'text/plain';

Middleware.readSrcFile = function() {
	return fs.readFileSync(this.config.src).toString();
};

Middleware.prototype.compile = function() {
	this.emit('compiled', this.config.src);
};

Middleware.prototype.handleRequest = function(req, res) {
	res.set({
		'Content-Length': this.compiledSource.length,
		'Content-Type': this.contentType
	});
	res.send(200, this.compiledSource);
};

module.exports = Middleware;
