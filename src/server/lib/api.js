import request from 'dataserverinterface/utils/request';

function throwError(msg) {
	throw new Error(msg);
}


export default {

	registerAnonymousEndPoints (express, config) {
		var prefix = /^\/api/i;
		Object.assign(this, config);

		express.get(/^\/api\/user-agreement/, this.serveUserAgreement.bind(this));

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
		var BODY_REGEX = /<body[^>]*>(.*)<\/body/i;
		var url = this['user-agreement'] || throwError('No user-agreement url set');

		if (/\/view/.test(req.url)) {
			res.redirect(url);
			return;
		}


		request(url, (error, r, response)=> {
			var body = BODY_REGEX.exec(response);

			var data = {
				status: r.statusCode,
				html: response,
				body: body && body[1]
			};

			res.status(data.status);
			res.json(data);
			res.end();
		});
	}
};
