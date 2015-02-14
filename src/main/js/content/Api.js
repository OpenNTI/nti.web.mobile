import {getService} from 'common/Utils';

export function getPageInfo (ntiid) {
	return getService()
		.then(service => service.getPageInfo(ntiid));
}
