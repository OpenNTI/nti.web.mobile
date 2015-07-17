/*eslint no-var: 0 strict: 0*/
'use strict';
var path = require('path');
var fs = require('fs');

module.exports = exports = function (dirname) {

	return function StatsCollector(/*compiler*/) {
		this.plugin('done', function(stats) {
			var p = path.join(dirname, 'stage', 'server');
			var file = path.join(p, 'stats.generated.json');
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
