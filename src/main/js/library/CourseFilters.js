'use strict';

var CourseFilters = {
	'Current': function(item,index,array) {
		try {
			var startDate = new Date(item.CourseInstance.CatalogEntry.StartDate);
			var endDate = new Date(item.CourseInstance.CatalogEntry.EndDate);
			var now = new Date();
			return startDate < now && endDate > now;
		}
		catch(e) {
			console.error(e);
			return false;
		}
	},
	'Upcoming': function(item,index,array) {
		try {
			var startDate = new Date(item.CourseInstance.CatalogEntry.StartDate);
			var now = new Date();
			return startDate > now;
		}
		catch(e) {
			console.error(e);
			return false;
		}
	},
	'Archived': function(item,index,array) {
		try {
			var endDate = new Date(item.CourseInstance.CatalogEntry.EndDate);
			var now = new Date();
			return endDate < now;	
		}
		catch(e) {
			console.error(e);
			return false;
		}
	}
};

module.exports = CourseFilters;
