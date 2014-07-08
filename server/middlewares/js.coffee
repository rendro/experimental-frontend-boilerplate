path       = require 'path'
es6ify     = require 'es6ify'
browserify = require 'browserify'
Middleware = require './middleware.coffee'

class Js extends Middleware

	filePattern: /\.js$/

	contentType: 'text/javascript'

	constructor: (@config) ->
		super(@config)
		if @config.traceur
			es6ify.traceurOverrides = @config.traceur

	logError: (err) ->
		errorMessage = "JavaScript compilation #{err}"
		@compiledSource = "console.error ? console.error(\"#{errorMessage}\") : console.log(\"#{errorMessage}\");"
		console.log(errorMessage.red)
		return

	compile: (file) =>
		file && console.log("[ES6] -> JavaScript compiled")
		contents = @readSrcFile()

		browserify()
			.add(es6ify.runtime)
			.transform(es6ify)
			.require(require.resolve(@config.src), { entry: true })
			.bundle({ debug: true }, (err, src) =>
				if err
					@logError(err)
				else
					@compiledSource = src
				super
			)
		return

module.exports = Js
