'use strict';

module.exports = function(opts) {
	opts = opts || {};

	Object.assign(this, opts);
	this.clickable = opts.hasOwnProperty('clickable') ? opts.clickable : !!this.href;
	this.isEmpty = (this.label||'').trim().length === 0 && this.children.length === 0;
};
