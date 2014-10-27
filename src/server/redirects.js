'use strict';

module.exports = function(_, res, next) {
	var url = _.originalUrl || _.url;
	var index = (url && url.indexOf('?')) || 0;

	if (index > 0) {
		res.redirect(url.substr(0, index) + '#notifications');
		return;
	}

	next();
};
