import logger from './logger';

const map = require('../../../sites.json');

const unknown = {name: 'default', title: 'nextthought'};

export default function getSite (site) {
	let s = map[site] || unknown;

	if (typeof s === 'string') {
		return getSite(s);
	}

	if (s === unknown) {
		logger.error('No site-mapping entry found for %s.', site);
	}
	return s;
}
