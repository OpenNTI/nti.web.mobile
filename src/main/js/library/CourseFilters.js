'use strict';

var filters = {
	'Current': function(item,index,array) {
		var startDate = new Date(item.CourseInstance.CatalogEntry.StartDate);
		var endDate = new Date(item.CourseInstance.CatalogEntry.EndDate);
		var now = new Date();
		return startDate < now && endDate > now;
	},
	'Upcoming': function(item,index,array) {
		var startDate = new Date(item.CourseInstance.CatalogEntry.StartDate);
		var now = new Date();
		return startDate > now;
	},
	'Archived': function(item,index,array) {
		var endDate = new Date(item.CourseInstance.CatalogEntry.EndDate);
		var now = new Date();
		return endDate < now;
	}
};

module.exports = filters;
