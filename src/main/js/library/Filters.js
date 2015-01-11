'use strict';

var Filters = [
	{
		name: 'Upcoming',
		filter: function(item) {
			try {
				var startDate = new Date(item.CourseInstance.CatalogEntry.StartDate);
				var now = new Date();
				return startDate > now;
			}
			catch(e) {
				console.error(e);
				return false;
			}
		}
	},
	{
		name: 'Current',
		filter: function(item) {
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
		}
	},
	{
		name: 'Archived',
		filter: function(item) {
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
	}
];

module.exports = Filters;
