'use strict'

module.exports = function(opts) {
	var opts = opts || {};
	this.label = opts.label;
	if(opts.href) {
		this.href = opts.href;	
	}
	this.disabled = this.href && !!opts.disabled;
	this.children = opts.children;
}
