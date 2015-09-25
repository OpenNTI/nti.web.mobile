import logger from './logger';

const map = require('../../../sites.json');

const unknown = 'unknown';

export default function getSite (site) {
	let s = map[site] || unknown;
	if (s === unknown) {
		logger.error('No site-mapping entry found for %s.', site);
	}
	return s;
}
