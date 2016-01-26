export default function passesFilter (item, query) {
	if (!query || query.trim().length === 0) {
		return true;
	}
	return item.Title.toLowerCase().indexOf(query.toLowerCase()) > -1;
}
