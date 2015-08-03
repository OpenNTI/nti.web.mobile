
export function isMimeType (item, itemType)	 {
	let type = item.MimeType
						.replace('application/vnd.nextthought.', '')
						.toLowerCase();
	return (itemType.indexOf(type) !== -1);
}
