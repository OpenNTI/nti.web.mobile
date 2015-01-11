'use strict';
var path = require('path');
var fs = require('fs');

module.exports = exports = function StyleCollector(/*compiler*/) {
	this.plugin('done', function(stats) {
		var p = path.join(__dirname, 'stage', 'server');
		var file = path.join(p, 'stats.generated.json');
		try {
			if (fs.existsSync(p)) {
				fs.writeFileSync(file, JSON.stringify(stats.toJson()));
			}
		} catch (e) {
			console.warn('Could not write %s', file);
		}
	});
};
