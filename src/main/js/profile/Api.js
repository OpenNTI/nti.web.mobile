
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
