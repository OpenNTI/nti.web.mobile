'use strict';

var Store = require('./Store');

module.exports = {
	loadDiscussions(course) {
		if(!course.getDiscussions) {
			throw new Error('course is expected to have a getDiscussions method');
		}
		var fn = result => {Store.setData(result);};
		course.getDiscussions()
		.then(fn, fn);
	}
};
