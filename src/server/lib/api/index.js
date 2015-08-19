import express from 'express';
import endpoints from './endpoints';

export function registerEndPoints (app, config, dataserver) {
	let api = express();
	app.use(/^\/api/i, api);

	function getService (req) {
		return req.ntiService
			? Promise.resolve(req.ntiService)
			: dataserver.getServiceDocument(req)
				.then(service => req.ntiService = service);
	}

	api.param('ntiid', (req, res, next, id) => {
		getService(req)
			.then(service => service.getParsedObject(id))
			.then(ob => {
				req.ntiidObject = ob;
				next();
			})
			.catch(next);
	});

	endpoints(api, config, dataserver);

	api.use((err, req, res, next) => {//eslint-disable-line no-unused-vars
		console.error('API Error:\n\n%s', err.stack);
		res.status(500).json({stack: err.stack, message: err.message});
		res.end();
	});
}
