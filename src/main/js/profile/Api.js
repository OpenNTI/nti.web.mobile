import {getService} from 'common/utils';

export function getBreadcrumb(ntiid) {
	return getService()
	.then(
		service => service.getContextPathFor(ntiid)
	);
}

export function getThumbnail(ntiid) {
	return getBreadcrumb(ntiid)
	.then(breadcrumb => {
		if (breadcrumb.length > 0 && breadcrumb[0].getPresentationProperties) {
			return (breadcrumb[0].getPresentationProperties() || {}).thumb;
		}
		return Promise.reject('No thumbnail found.');
	});
}
