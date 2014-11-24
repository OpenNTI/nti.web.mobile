'use strict';
var compiler = require('es3-safe-recast');

module.exports = function(source) {
	this.cacheable();

	return compiler.compile(source);
};
