import {scoped} from 'common/locale';

let getLabel = scoped('LIBRARY.CATEGORY');

export default [
	{
		name: getLabel('upcoming'),
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
		name: getLabel('current'),
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
		name: getLabel('archived'),
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
		},

		split: list => {
			let bins = {};

			let add = (sort, label, i) => {
				let o = bins[label] || {sort, label, items:[]};
				bins[label] = o;
				o.items.push(i);
			};

			list.forEach(item=> {
				try {
					let start = item.getStartDate();
					let key = 'archivedGroup.' + start.getMonth();
					let bin = getLabel(key, {year: start.getFullYear()});

					add(start, bin, item);

				} catch (e) {
					console.error(e);
				}
			});


			bins = Object.values(bins);
			bins.sort((a,b)=>b.sort - a.sort);

			return bins;
		}
	}
];
