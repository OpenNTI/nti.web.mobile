import {scoped} from 'common/locale';

let getLabel = scoped('LIBRARY.CATEGORY');

function courseSortComparatorFunc(a, b) {

	function strComp(s1, s2) {
		return s1 < s2 ? -1 : s1 > s2 ? 1 : 0;
	}

	return strComp((a||{}).ProviderUniqueID, (b||{}).ProviderUniqueID) || strComp((a||{}).title, (b||{}).title);
}

export default [
	{
		name: getLabel('upcoming'),
		path: 'upcoming',
		filter: item => {
			try {
				let start = item.getStartDate();
				return start > Date.now();
			}
			catch(e) {
				console.error(e);
				return false;
			}
		},
		sort: courseSortComparatorFunc
	},
	{
		name: getLabel('current'),
		path: 'current',
		filter: item => {
			try {
				let now = Date.now();
				let start = item.getStartDate();
				let end = item.getEndDate();

				return start < now && end > now;
			}
			catch(e) {
				console.error(e);
				return false;
			}
		},
		sort: courseSortComparatorFunc
	},
	{
		name: getLabel('archived'),
		path: 'archived',
		filter: item => {
			try {
				let end = item.getEndDate();
				return end < Date.now();
			}
			catch(e) {
				console.error(e);
				return false;
			}
		},
		sort: courseSortComparatorFunc,
		split: list => {
			let bins = {};

			let add = (sort, label, i) => {
				let o = bins[label] || {sort, label, items: []};
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
			bins.sort((a, b)=>b.sort - a.sort);

			return bins;
		}
	}
];
