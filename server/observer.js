var Observer = function() {
	this.callbacks = {};
};

Observer.prototype.on = function(events, callback) {
	events.split(' ').forEach(function(event) {
		this.callbacks[event] = this.callbacks[event] || [];
		this.callbacks[event].push(callback);
	}.bind(this));
	return this;
};

Observer.prototype.emit = function(event) {
	if (!this.callbacks[event]) {
		return;
	}
	var args = Array.prototype.slice.call(arguments, 1);
	this.callbacks[event].forEach(function(callback) {
		callback.apply(null, args);
	});
	return this;
};

module.exports = Observer;
