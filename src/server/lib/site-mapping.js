import logger from './logger';

const map = {
	'ou-alpha.nextthought.com': 'platform.ou.edu',
	'ou-test.nextthought.com': 'platform.ou.edu',
	'janux.ou.edu': 'platform.ou.edu',
	'okstate.nextthought.com': 'okstate.nextthought.com',
	'okstate-alpha.nextthought.com': 'okstate.nextthought.com',
	'okstate-test.nextthought.com': 'okstate.nextthought.com',
	'learnonline.okstate.edu': 'okstate.nextthought.com',
	'symmys.nextthought.com': 'symmys.nextthought.com',
	'symmys-alpha.nextthought.com': 'symmys.nextthought.com',
	'lab.symmys.com': 'symmys.nextthought.com'
};

const unknown = 'unknown';

export default function getSite (site) {
	let s = map[site] || unknown;
	if (s === unknown) {
		logger.error('No site-mapping entry found for %s.', site);
	}
	return s;
}
