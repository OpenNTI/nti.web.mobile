'use strict';

module.exports = function(opts) {
	opts = opts || {};
	this.label = opts.label;
	if(opts.href) {
		this.href = opts.href;
	}
	if(opts.navbarTitle) {
		this.navbarTitle = opts.navbarTitle;
	}
	this.clickable = opts.hasOwnProperty('clickable') ? opts.clickable : !!this.href;
	this.children = opts.children;
};
