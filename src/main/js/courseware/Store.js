'use strict';

var Library = require('library');

var sectionNames = {
	courses: 'courses',
	books: 'books',
	catalog: 'catalog'
};

var Store = {
	getSectionNames: function() {
		return Object.keys(sectionNames);
	},

	defaultSection: function() {
		return Library.Actions.load().then(function() {
			var data = Library.Store.getData();
			// if user doesn't have any courses default to the catalog.
			return data.courses.length > 0 ? sectionNames.courses : sectionNames.catalog;
		}.bind(this));
	}
};

module.exports = Store;
