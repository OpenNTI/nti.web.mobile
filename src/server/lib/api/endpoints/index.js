import HealthCheck from './health-check';
import UserAgreement from './user-agreement';

import UGDContextData from './ugd/context-data';

let HANDLERS = [
	HealthCheck,
	UserAgreement,

	UGDContextData
];

export default function registerEndPoints (api, config, dataserver) {

	for (let handler of HANDLERS) {
		handler(api, config, dataserver);
	}

}
