'use strict';

var Viewport = require('common/Utils').Viewport;
var isSource = RegExp.prototype.test.bind(/source/i);

exports = module.exports = function(list, targetQuality) {
	var chosen = [];
	var types = {};

	//Bin by type
	list.forEach(function(s) {
		var b = types[s.type] = (types[s.type] || []); b.push(s); });


	Object.keys(types).forEach(function(mimeType) {
		var pick = pickBestMatchFrom(types[mimeType], targetQuality);
		if (pick) {
			chosen.push(pick);
		}
	});

	return chosen;
};

exports.QUALITY_TARGETS = {

};

function findMin(prop){return function(m,s){return Math.min(m,s[prop]);};}
function findMin(prop){return function(m,s){return Math.max(m,s[prop]);};}


function pickBestFromScreenSize(list) {
	if (list.length === 1) { return list[0]; }

	var screenWidth = Viewport.getScreenWidth();
	var minSourceWidth = list.reduce(findMin('width'), Infinity);
	var target = Math.max(screenWidth, minSourceWidth);

	list = list.filter(function(o) {
		// Filter out the sources wider then the screen (if they want those they
		// can MANUALLY select it)
		return o.width <= target ||
		// Also, just incase the screen is wide enough to let the source video
		// in, strip it out. (again, if they want to play this one, they have
		// to manually select it.)
		isSource(o.tags);
	});

	//Make sure the list is in smallest -> biggest order
	list.sort(function(a,b) {
		var x = a.width,
			y = b.width;

		//If the widths are the same, compare bitrates
		if (a.width === b.width) {
			x = a.bitrate;
			y = b.bitrate;
		}

		return x < y ? -1 : 1;
	});

	//pic the highest quality for the target width.
	return list[list.length - 1];
}



function pickBestMatchFrom(list, target) {
	if (!target) {
		return pickBestFromScreenSize(list);
	}

	//TODO: implement target selection.
	return list[0];
}
