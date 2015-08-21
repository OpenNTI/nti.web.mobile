import {getModel} from 'nti.lib.interfaces';
const PageInfo = getModel('pageinfo');

class GetContextData {
	constructor (config, server) {
		this.server = server;
	}

	handle (req, res, error) {
		let {ntiidObject} = req;

		let container = ntiidObject.getContainerID();

		req.ntiService.getParsedObject(container)
			.then(obj => obj instanceof PageInfo ? this.getContext(req, obj) : obj)
			.then(o => res.json(o))
			.catch(error);
	}



	getContext (req, pageInfo) {
		// let {ntiidObject} = req;
		// let {applicableRange} = ntiidObject;

		return pageInfo.getContent()
			.then(html => {

				return {html};
			});
	}
}


export default function register (api, config, dataserver) {
	let handler = new GetContextData(config, dataserver);
	api.get('/ugd/context-data/:ntiid', (req, res, error) => handler.handle(req, res, error));
}
