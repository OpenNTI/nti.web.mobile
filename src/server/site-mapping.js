'use strict';

var map = {
	'ou-alpha.nextthought.com': 'platform.ou.edu',
	'ou-test.nextthought.com': 'platform.ou.edu',
	'janux.ou.edu': 'platform.ou.edu',
	'okstate-alpha.nextthought.com': 'okstate.nextthought.com',
	'okstate-test.nextthought.com': 'okstate.nextthought.com',
	'learnonline.okstate.edu': 'okstate.nextthought.com'
};



module.exports = function getSite(site) {

	return map[site] || site;
};
