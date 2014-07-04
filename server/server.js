var fs      = require('fs');
var path    = require('path');
var cons    = require('consolidate');
var express = require('express');
var logger  = require('morgan');

var app = express();

var rootDir   = process.cwd();
var staticDir = path.join(rootDir, 'static');
var viewsDir  = path.join(process.cwd(), 'views');

app.set('page.title', 'NextGen Boilerplate');

app.set('port', process.env.PORT || 3000);

app.engine('html', cons.handlebars);
app.set('view engine', 'html');
app.set('views', viewsDir);


if (app.get('env') === 'development') {
	app.use(logger('dev'));
	app.locals.LRScript = "<script>document.write('<script src=\"http://' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js\"></' + 'script>')</script>";
	lrServer = require('livereload').createServer({ exts: [ 'html' ] });
	lrServer.watch(viewsDir);
} else {
	app.use(logger());
	app.locals.LRScript = "";
}

/**
 * CSS PREPROCESSOR
 **/
var Myth = require('./middlewares/myth.js');

var myth = new Myth({
	src: path.join(staticDir, 'stylesheets', 'myth', 'app.css'),
	autoprefixer: [
		'last 2 versions',
		'> 1%'
	]
});

app.use('/app.css', myth.handleRequest);

myth.on('compiled', function(file) {
	lrServer.refresh('/app.css');
});

/*
var Less = require('./middlewares/less');
var less = new Less({
	src: path.join(staticDir, 'stylesheets', 'less', 'app.less'),
	paths: [
		path.join(process.cwd(), 'node_modules')
	],
	autoprefixer: [
		'last 2 versions',
		'> 1%'
	]
});
app.use('/app.css', less.handleRequest);
less.on('compiled', function(file) {
	lrServer.refresh('/app.css');
});
*/

/**
 * JS PREPROCESSOR
 **/
// var JavaScript = require('./middlewares/js');

// var javascript = new JavaScript({
// 	src: path.join(staticDir, 'javascript', 'app.js'),
// 	traceur: { blockBinding: true }
// });

// app.use('/app.js', javascript.handleRequest);

// js.on('compiled', function(file) {
// 	lrServer.refresh('/app.js');
// });


app.get('*/', function(req, res) {
	res.render('layouts/default', {
		title: app.get('page.title'),
		partials: {
			content: '../pages/' + (req.url.substr(1) || 'index')
		}
	});
});

app.listen(app.get('port'), function() {
	console.log('Server listening on port ' + app.get('port'));
});
