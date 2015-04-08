import fs from 'fs';
import guid from 'nti.lib.interfaces/utils/guid';
import logger from './logger';
import path from 'path';

const basepathreplace = /(manifest|src|href)="(.*?)"/igm;

const isRootPath = /^\/(?!\/).*/;


export default function setupErrorHandler(express, config) {
	const basePath = express.mountpath || '/';
	const appConfig = config;

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

		let errorid = guid();
		logger.error(errorid, err);

		let body;

		try {
			body = preprocess(template, {
				err,
				errorid,
				appVersion: (appConfig.appVersion || 'Unknown version (development?)')
			});
		} catch (er) {
			logger.error(errorid, er.stack || er.message || er);
			body = 'Couldn\'t populate error template.';
		}

		res.status(err.statusCode || 500).send(body);
	});
}

function preprocess(templateStr, data={}) {
	// {
	// 	err={},
	// 	errorid,
	// 	appVersion,
	// }
	// return templateStr.replace(/(id="error">).*(<\/)/, '$1<pre><code>' + (err.stack || err.message || err) + '</code></pre>$2');
	Object.keys(data).forEach(key => {
		templateStr = templateStr.replace('{' + key + '}', data[key] || '');
	});

	// strip remaining placeholders before returning the result.
	return templateStr.replace(/\{.*\}/, '');

}
