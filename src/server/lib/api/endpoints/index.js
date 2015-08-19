import HealthCheck from './health-check';
import UserAgreement from './user-agreement';

let HANDLERS = [
	HealthCheck,
	UserAgreement
];

export default function registerEndPoints (api, config, dataserver) {

	for (let handler of HANDLERS) {
		handler(api, config, dataserver);
	}

}
