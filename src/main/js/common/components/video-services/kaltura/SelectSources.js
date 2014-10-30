'use strict';


function pickBestMatchFrom(list, target) {
	return list[0];
}


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
