import {getService} from 'common/utils';

export function getPageInfo (ntiid) {
	return getService()
		.then(service => service.getPageInfo(ntiid));
}
