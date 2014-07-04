var path         = require('path');
var myth         = require('myth');
var colors       = require('colors');
var Middleware   = require('./middleware.js');

var Myth = function(config) {
	this.options = {
		source: config.src,
		browsers: config.autoprefixer
	};
	Middleware.call(this, config);
	this.compile();
};

Myth.prototype = Object.create(Middleware.prototype);

Myth.prototype.filePattern = /\.css$/;

Myth.prototype.contentType = 'text/css';

Myth.prototype.logError = function(err) {
	errorMessage = 'Myth error: ' + err.message;
	this.compiledSource = 'body::before{display:block;content:"' + errorMessage + '";background:white;color:red;border:3px solid red;padding: 20px;font:20px/1.5 Helvetica,Arial,sans-serif;}';
	console.log(errorMessage.red);
};

Myth.prototype.compile = function(file) {
	file && console.log('[Myth] -> CSS compiled');
	contents = this.readSrcFile();
	try {
		this.compiledSource = myth(contents, this.options);
		console.log(this.prototype);
	} catch (e) {
		this.logError(e);
	}
};

module.exports = Myth;
