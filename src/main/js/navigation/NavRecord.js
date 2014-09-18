'use strict'

module.exports = function(opts) {
	var opts = opts || {};
	this.label = opts.label;
	if(opts.href) {
		this.href = opts.href;	
	}
	this.clickable = opts.hasOwnProperty('clickable') ? opts.clickable : !!this.href;
	this.children = opts.children;
}
