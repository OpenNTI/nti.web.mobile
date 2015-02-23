'use strict';

function binHasData(item) {
	return Object.keys(item).some(key => {
		return Array.isArray(item[key]) && item[key].length > 0;
	});
}

/* remove empty boards (e.g. Parent, Section) from a bin (e.g. ForCredit, Other, Open)
*	input:
*	{
*		Parent: [],
*		Section: [{ Announcements: {} }]
*	}
*	output:
*	{
*		Section: [{ Announcements: {} }]
*	}
*/
function filterBin(bin) {
	var result = {};
	Object.keys(bin).forEach(key => {
		// e.g. Parent, Section
		var board = bin[key];
		if (board.length > 0) {
			result[key] = board;
		}
	});
	return result;
}

// remove empty bins (e.g. ForCredit, Open, Other)
// and remove empty boards (Parent, Section) from each bin.
function filterForumBins(bins) {
	var result = {};
	Object.keys(bins).forEach(key => {
		// e.g. ForCredit, Open, Other
		var bin = bins[key];
		if(binHasData(bin)) {
			result[key] = filterBin(bin);
		}
	});
	return result;
}

module.exports = filterForumBins;
