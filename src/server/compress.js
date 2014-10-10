'use strict';
var WantsCompressed = /gzip/i;

var mimes = require('mime-types');
var compressible = require('compressible');
var compression = require('compression');
var path = require('path');
var Url = require('url');
var fs = require('fs');

exports.attachToExpress = function(expressApp, assetPath) {

	expressApp.all('*', function(req, res, next) {
		var ext = path.extname(Url.parse(req.url).pathname);
		var gz = req.url + '.gz';

		var type = mimes.lookup(ext);

		var compress = WantsCompressed.test(req.header('accept-encoding') || '');
		if (compress && fs.existsSync(path.join(assetPath, gz))) {
			req.url = gz;
			res.set('Content-Encoding', 'gzip');
			if (type) {
				res.set('Content-Type', type);
			}
		}

		next();
	});


	expressApp.use(compression({
		filter: function filter(req, res) {
			var type = res.getHeader('Content-Type');
			var isGz = path.extname(Url.parse(req.url).pathname) === '.gz';

			if (isGz || (type !== undefined && !compressible(type))) {
				//console.debug('Not compressing: %s %s ', req.url, type);
				return false;
			}

			return true;
		}
	}));
};
