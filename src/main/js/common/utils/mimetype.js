
export function isMimeType(item, itemType)	 {
	var type = item.MimeType
						.replace('application/vnd.nextthought.', '')
						.toLowerCase();
		return (itemType.indexOf(type) !== -1);
}
