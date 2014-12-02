'use strict';

Object.assign(exports, {

	getMainSubmittable: function (o) {
		var p;

		do {
			p = o && o.up('getSubmission');
			if (p) { o = p; }

		} while (p);

		return o;
	}

});
