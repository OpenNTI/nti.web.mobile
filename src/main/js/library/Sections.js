'use strict';

var Actions = require('./Actions');
var Store = require('./Store');

var sectionNames = {
	courses: 'courses',
	books: 'books',
	catalog: 'catalog'
};

module.exports = {

	getSectionNames: function() {
		return Object.keys(sectionNames);
	},

	defaultSection: function() {
		return Actions.load().then(function() {
			var data = Store.getData();
			// if user doesn't have any courses default to the catalog.
			return data.courses.length > 0 ? sectionNames.courses : sectionNames.catalog;
		}.bind(this));
	}
};
