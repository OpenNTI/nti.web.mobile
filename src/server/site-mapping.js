'use strict';

var map = {
	'ou-alpha.nextthouht.com': 'platform.ou.edu',
	'ou-test.nextthouht.com': 'platform.ou.edu',
	'janux.ou.edu': 'platform.ou.edu'
};



module.exports = function getSite(site) {
	
	return map[site] || site;
};
