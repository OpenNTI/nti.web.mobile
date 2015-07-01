import {getService} from 'common/utils';

export function getBreadcrumb(ntiid) {
	return getService()
	.then(
		service => service.getContextPathFor(ntiid)
	);
}
