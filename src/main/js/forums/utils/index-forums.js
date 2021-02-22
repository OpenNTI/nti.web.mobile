import { mimeTypes, FORUM } from '../Constants';

// walks a binned discussions hierarchy looking for forum objects
// and returns a map of forumId to forum
export default function indexForums(input, result) {
	result = result || {};
	if (Array.isArray(input)) {
		input.forEach(item => {
			// is forum? add entry to result;
			if (
				item &&
				Object.prototype.hasOwnProperty.call(item, 'MimeType') &&
				mimeTypes[FORUM].some(x => ~(item.MimeType || '').indexOf(x))
			) {
				result[item.getID()] = item;
			}
		});
	} else if (typeof input === 'object') {
		Object.keys(input).forEach(key => {
			result = indexForums(input[key], result);
		});
	}

	return result;
}
