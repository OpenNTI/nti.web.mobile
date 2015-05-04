import {EventEmitter} from 'events';
import {getService} from 'common/utils';

let user;

class Store extends EventEmitter {

	constructor() {
		super();
		try {
			getService().then(service => {
				service.getAppUser().then(u => {
					user = u;
				});
			});
		}
		catch (e) {
			console.error(e.stack || e.message || e);
		}
	}

	getUserEmail() {
		return (user || {}).email;
	}

	getUserRealName() {
		return (user || {}).realname;
	}

}

export default new Store();
