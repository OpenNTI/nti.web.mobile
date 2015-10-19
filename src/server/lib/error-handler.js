import fs from 'fs';
import uuid from 'node-uuid';
import logger from './logger';
import path from 'path';

const basepathreplace = /(manifest|src|href)="(.*?)"/igm;

const isRootPath = /^\/(?!\/).*/;


export default function setupErrorHandler (express, config) {
	const basePath = express.mountpath || '/';
	const appConfig = config;

	//Fail fast, if readFileSync throws, it will halt node.
	//Second, keep this in memory once, no need to read it from disk every time.
	let file = path.resolve(__dirname, '../../main/error.html');
	if (!fs.existsSync(file)) {
		file = path.resolve(__dirname, '../../client/error.html');
	}

	const template = fs.readFileSync(file, 'utf8')
						.replace(basepathreplace, (original, attr, val) =>
							attr + '="' + (isRootPath.test(val) ? (basePath + val.substr(1)) : val) + '"');

	// We need the signature to be 4 args long
	// for express to treat it as a error handler
	express.use(function (err, req, res, next) { // eslint-disable-line no-unused-vars
		if (!err) {
			err = 'Unknown Error';
		}
		else if (err.toJSON) {
			err = err.toJSON();
		}
		else if (err.stack) {
			err = err.stack;
		}

		let errorid = uuid.v4();
		logger.error(errorid, err);

		let body;

		try {
			let data = {
				err,
				errorid,
				appVersion: (appConfig.appVersion || 'Unknown version (development?)')
			};

			// // add contact phone and email if available.
			// let {contacts} = appConfig;

			// if (contacts) {
			// 	let tmp = "<div class=\"contact\"><p>If you'd like to contact support about this issue you may reach us via the following channels:</p>";
			// 	Object.keys(contacts).forEach( key => {
			// 		tmp = tmp.concat('<div class="contact-item"><span class="contact-method">', key, '</span>:<span class="contact-detail">', contacts[key], '</span></div>');
			// 	});
			// 	data['contact'] = tmp.concat('</div>');
			// }

			body = preprocess(template, data);
		} catch (er) {
			logger.error(errorid, er.stack || er.message || er);
			body = 'Couldn\'t populate error template.';
		}

		res.status(err.statusCode || 500).send(body);
	});
}

function preprocess (templateStr, data = {}) {
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
	return templateStr.replace(/\{.*\}/g, '');

}
