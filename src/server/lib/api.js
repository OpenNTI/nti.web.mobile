import request from 'nti.lib.interfaces/utils/request';

function throwError (msg) {
	throw new Error(msg);
}


export default {

	registerAnonymousEndPoints (express, config) {
		let prefix = /^\/api/i;
		Object.assign(this, config);

		express.get(/^\/api\/user-agreement/, this.serveUserAgreement.bind(this));


		express.get(/^\/api\/_ops\/ping/, this.handleHealthCheck.bind(this));


		express.use(/^\/api/, (err, req, res, next) => {
			if (prefix.test(req.url)) {
				console.error('API Error:\n\n%s', err.stack);
				res.status(500).json({stack: err.stack, message: err.message});
				res.end();
				return;
			}
			next();
		});
	},


	registerAuthenticationRequiredEndPoints () {},//function(express, config) {},


	serveUserAgreement (req, res) {
		let BODY_REGEX = /<body[^>]*>(.*)<\/body/i;
		let url = this['user-agreement'] || throwError('No user-agreement url set');

		if (/\/view/.test(req.url)) {
			res.redirect(url);
			return;
		}


		request(url, (error, r, response)=> {
			let body = BODY_REGEX.exec(response);

			let data = {
				status: r.statusCode,
				html: response,
				body: body && body[1]
			};

			res.status(data.status);
			res.json(data);
			res.end();
		});
	},


	handleHealthCheck (_, res) {
		let {server} = this;

		let url = server.replace(/\/?dataserver2.+$/, '');

		request(url + '/_ops/ping', (error)=> {
			res.status(error ? 503 : 200);
			res.end();
		});
	}
};
