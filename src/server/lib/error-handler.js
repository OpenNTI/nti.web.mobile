import logger from './logger';
import Path from 'path';
import fs from 'fs';

// We need the signature to be 4 args long
// for express to treat it as a error handler
export default function(err, req, res, next){ // eslint-disable-line no-unused-vars
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

	let template;

	try {
		template = fs.readFileSync(Path.resolve(__dirname, '../../main/error.html'), 'utf8');
		template = preprocess(template, err);
	} catch (er) {
		logger.error('%s', er.stack || er.message || er);
		template = 'Couldn\'t load error template.';
	}

	res.status(err.statusCode || 500).send(template);
}

function preprocess(templateStr, err={}) {
	return templateStr.replace(/(id="error">).*(<\/)/, '$1<pre><code>' + (err.stack || err.message || err) + '</code></pre>$2');
}

