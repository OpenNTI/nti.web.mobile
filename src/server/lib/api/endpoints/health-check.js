import request from 'nti.lib.interfaces/utils/request';

export default function register (api, config) {
	let {server} = config;

	api.get(/^\/_ops\/ping/, (_, res) => {
		let url = server.replace(/\/?dataserver2.+$/, '');

		request(url + '/_ops/ping', (error)=> {
			res.status(error ? 503 : 200);
			res.end();
		});
	});
}
