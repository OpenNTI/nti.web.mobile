import express from 'express';
import endpoints from './endpoints';

export function registerEndPoints (app, config) {
	let api = express();
	app.use(/^\/api/i, api);

	endpoints(api, config);

	api.use((err, req, res, next) => {//eslint-disable-line no-unused-vars
		console.error('API Error:\n\n%s', err.stack);
		res.status(500).json({stack: err.stack, message: err.message});
		res.end();
	});
}
