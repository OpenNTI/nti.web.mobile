'use strict';

var map = {
	'ou-alpha.nextthought.com': 'platform.ou.edu',
	'ou-test.nextthought.com': 'platform.ou.edu',
	'janux.ou.edu': 'platform.ou.edu'
};



module.exports = function getSite(site) {

	return map[site] || site;
};
