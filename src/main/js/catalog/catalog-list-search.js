export default function passesFilter (query, item) {
	if (!query || query.trim().length === 0) {
		return true;
	}
	const {Title: title} = item;
	return title && title.toLowerCase().indexOf(query.toLowerCase()) > -1;
}
