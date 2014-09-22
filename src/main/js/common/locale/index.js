'use strict';

var counterpart = require('counterpart');
counterpart.registerTranslations('en', require('./en.js'));

function translate(key, options) {
	return counterpart.apply(null, arguments);
}

function scoped(scope) {
	return function(key, options) {
		var opts = (options || {});
		opts.scope = scope;
		return counterpart.apply(this, [key, opts]);
	};
}

exports.translate = translate;
exports.scoped = scoped;
