const WantsCompressed = /gzip/i;

import mimes from 'mime-types';
import compressible from 'compressible';
import compression from 'compression';

import path from 'path';
import Url from 'url';
import fs from 'fs';

export function attachToExpress (expressApp, assetPath) {

	expressApp.all('*', function (req, res, next) {
		let ext = path.extname(Url.parse(req.url).pathname);
		let gz = req.url + '.gz';

		let type = mimes.lookup(ext);

		let compress = WantsCompressed.test(req.header('accept-encoding') || '');
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
		filter (req, res) {
			let type = res.getHeader('Content-Type');
			let isGz = path.extname(Url.parse(req.url).pathname) === '.gz';

			if (isGz || (type !== undefined && !compressible(type))) {
				//console.debug('Not compressing: %s %s ', req.url, type);
				return false;
			}

			return true;
		}
	}));
}
