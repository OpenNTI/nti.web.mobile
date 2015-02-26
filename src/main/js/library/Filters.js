export default [
	{
		name: 'Upcoming',
		path: 'upcoming',
		filter: item => {
			try {
				var start = item.getStartDate();
				return start > Date.now();
			}
			catch(e) {
				console.error(e);
				return false;
			}
		}
	},
	{
		name: 'Current',
		path: 'current',
		filter: item => {
			try {
				var now = Date.now();
				var start = item.getStartDate();
				var end = item.getEndDate();

				return start < now && end > now;
			}
			catch(e) {
				console.error(e);
				return false;
			}
		}
	},
	{
		name: 'Archived',
		path: 'archived',
		filter: item => {
			try {
				var end = item.getEndDate();
				return end < Date.now();
			}
			catch(e) {
				console.error(e);
				return false;
			}
		}
	}
];
