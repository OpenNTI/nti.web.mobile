var counterpart = require('counterpart');
counterpart.registerTranslations('en',require('./en.js'));

function translate(key,options) {
	return counterpart(key,options);
}

module.exports = translate;
