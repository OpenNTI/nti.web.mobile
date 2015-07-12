import {getService} from 'common/utils';

export function getBreadcrumb(item) {
	return (item || {}).getContextPath ? item.getContextPath() : Promise.reject('item doesn\'t have a getContextPath method.');
}

export function getThumbnail(item) {
	return getBreadcrumb(item)
	.then(breadcrumb => {
		if (breadcrumb.length > 0 && breadcrumb[0][0].getPresentationProperties) {
			return (breadcrumb[0][0].getPresentationProperties() || {}).thumb;
		}
		return Promise.reject('No thumbnail found.');
	});
}

export function leaveGroup(entity) {
	if (!entity || !entity.getLink) {
		console.error('Group entity with getLink method is required for leaveGroup.');
	}
	let link = entity.getLink('my_membership');
	return getService().then(service => {
		return service.delete(link);
	});
}

export function savePost(postItem, value) {
	let link = postItem.getLink('edit');
	if (!link) {
		return Promise.reject('postItem has no \'edit\' link.');
	}
	return getService().then(service => {
		return service.put(link, value);
	});
}

export function deletePost(postItem) {
	return getService().then(service => {
		return service.delete(postItem.href);
	});
}
