'use strict'

module.exports = function(opts) {
	var opts = opts || {};
	this.label = opts.label;
	this.href = opts.href;
	this.disabled = !!opts.disabled
}
