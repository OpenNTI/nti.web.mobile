import logger from './logger';
import path from 'path';
import fs from 'fs';

const basepathreplace = /(manifest|src|href)="(.*?)"/igm;

const isRootPath = /^\/(?!\/).*/;


export default function setupErrorHandler(express) {
	const basePath = express.mountpath || '/';

	//Fail fast, if readFileSync throws, it will halt node.
	//Second, keep this in memory once, no need to read it from disk every time.
	const template = fs.readFileSync(path.resolve(__dirname, '../../main/error.html'), 'utf8')
						.replace(basepathreplace, (original, attr, val) =>
							attr + '="' + (isRootPath.test(val) ? (basePath + val.substr(1)) : val) + '"');

	// We need the signature to be 4 args long
	// for express to treat it as a error handler
	express.use(function(err, req, res, next){ // eslint-disable-line no-unused-vars
		if (!err) {
			err = 'Unknown Error';
		}
		else if (err.toJSON) {
			err = err.toJSON();
		}
		else if (err.stack) {
			err = err.stack;
		}

		logger.error(err);

		let body;

		try {
			body = preprocess(template, err);
		} catch (er) {
			logger.error('%s', er.stack || er.message || er);
			body = 'Couldn\'t populate error template.';
		}

		res.status(err.statusCode || 500).send(body);
	});
}

function preprocess(templateStr, err={}) {
	return templateStr.replace(/(id="error">).*(<\/)/, '$1<pre><code>' + (err.stack || err.message || err) + '</code></pre>$2');
}
