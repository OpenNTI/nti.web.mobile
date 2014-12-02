'use strict';

var counterpart = require('counterpart');

counterpart.registerTranslations('en', require('./en.js'));

var siteName = require('../Utils').getSiteName();

var locale = counterpart.getLocale();

if (siteName) {
	console.debug('Site Locale: %s.%s',siteName, locale);

	require(['./sites/' + siteName + '/' + locale + '.js'], function(translation) {
		counterpart.registerTranslations(locale, translation);
		counterpart.emit('localechange', locale, locale);
	});
}


function translate(/*key, options*/) {
	return counterpart.apply(null, arguments);
}

function scoped(scope) {
	return function(key, options) {
		var opts = (options || {});
		opts.scope = scope;
		return counterpart.apply(this, [key, opts]);
	};
}

function addListener(fn) {
	counterpart.onLocaleChange(fn);
}

function removeListener(fn) {
	counterpart.offLocaleChange(fn);
}

exports.addChangeListener = addListener;
exports.removeChangeListener = removeListener;
exports.translate = translate;
exports.scoped = scoped;
