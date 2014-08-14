"use strict";

var Utils = {
	getLink: function(o, rel) {
		if (o && o.Links) { o = o.Links; }

		var v, i = o.length - 1;
		for (i; i>=0; i--) {
			v = o[i];
			if (v && v.rel === rel) {
				return v;
			}
		}
	}
}

module.exports = Utils;
