/*eslint strict: 0, no-console: 0*/
'use strict';
const path = require('path');
const fs = require('fs');

module.exports = exports = function (dirname) {

	return function StatsCollector (/*compiler*/) {
		this.plugin('done', function (stats) {
			const p = path.join(dirname, 'stage', 'server');
			const file = path.join(p, 'stats.json');
			try {
				if (fs.existsSync(p)) {
					fs.writeFileSync(file, JSON.stringify(stats.toJson()));
				}
			} catch (e) {
				console.warn('Could not write %s, because %s', file, e.stack || e.message || e);
			}
		});
	};
};
