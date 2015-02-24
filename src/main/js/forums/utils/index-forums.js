'use strict';

var {types} = require('../Constants');

// walks a binned discussions hierarchy looking for forum objects
// and returns a map of forumId to forum
function indexForums(input, result) {
	var result = result || {};
	if (Array.isArray(input)) {
		input.forEach(item => {
			// is forum? add entry to result;
			if (item && item.hasOwnProperty('MimeType') && (item.MimeType||'').indexOf(types.FORUM) > -1) {
				result[item.getID()] = item;
			}
		});
	}
	else if (typeof input === 'object') {
		Object.keys(input).forEach(key => {
			result = indexForums(input[key], result);
		});
	}
	
	return result;
}

module.exports = indexForums;
