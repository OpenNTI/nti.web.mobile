import HealthCheck from './health-check';
import UserAgreement from './user-agreement';
import GraphQL from './graphql';

import UGDContextData from './ugd/context-data';

let HANDLERS = [
	HealthCheck,
	UserAgreement,
	GraphQL,

	UGDContextData
];

export default function registerEndPoints (api, config, dataserver) {

	for (let handler of HANDLERS) {
		handler(api, config, dataserver);
	}

}
