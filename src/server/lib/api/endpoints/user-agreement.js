import request from 'nti.lib.interfaces/utils/request';

const BODY_REGEX = /<body[^>]*>(.*)<\/body/i;
const SHOULD_REDIRECT = RegExp.prototype.test.bind(/\/view/);

class ServeUserAgreement {
	constructor (config) {
		this.url = config['user-agreement'];
	}

	handle (req, res) {

		let {url} = this;
		if (!url) {
			throw new Error('No user-agreement url set');
		}

		if (SHOULD_REDIRECT(req.url)) {
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
	}
}


export default function register (api, config) {
	let handler = new ServeUserAgreement(config);
	api.get(/^\/user-agreement/, (req, res) => handler.handle(req, res));
}
