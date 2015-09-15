import {scoped} from 'common/locale';

export const CURRENT = 'current';
export const UPCOMING = 'upcoming';
export const ARCHIVED = 'archived';

let getLabel = scoped('LIBRARY.CATEGORY');

function courseSortComparatorFunc (a, b) {

	// function strComp (s1, s2) {
	// 	return (s1 || '').localeCompare(s2);
	// }
	//
	// return strComp((a || {}).ProviderUniqueID, (b || {}).ProviderUniqueID)
	// 	|| strComp((a || {}).title, (b || {}).title);

	//reverse cronological (put newest on the front)
	return b.getCreatedTime() - a.getCreatedTime();
}


function splitBySemester (list) {
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



export default [
	{
		get path () { throw new Error('Use .kind instead'); },
		get filter () { throw new Error('Use .test instead'); },

		name: getLabel(UPCOMING),
		kind: UPCOMING,

		test: item => {
			try {
				let start = item.getStartDate();
				return start > Date.now();
			}
			catch(e) {
				console.error('Filtering out bad Item: %o, because: ', item,  e.message || e);
				return false;
			}
		},
		sort: courseSortComparatorFunc,
		split: splitBySemester
	},
	{
		get path () { throw new Error('Use .kind instead'); },
		get filter () { throw new Error('Use .test instead'); },

		name: getLabel(CURRENT),
		kind: CURRENT,
		test: item => {
			try {
				let now = Date.now();
				let start = item.getStartDate();
				let end = item.getEndDate();

				return start < now && end > now;
			}
			catch(e) {
				console.error('Filtering out bad Item: %o, because: ', item,  e.message || e);
				return false;
			}
		},
		sort: courseSortComparatorFunc
	},
	{
		get path () { throw new Error('Use .kind instead'); },
		get filter () { throw new Error('Use .test instead'); },

		name: getLabel(ARCHIVED),
		kind: ARCHIVED,
		test: item => {
			try {
				let end = item.getEndDate();
				return end < Date.now();
			}
			catch(e) {
				console.error('Filtering out bad Item: %o, because: ', item,  e.message || e);
				return false;
			}
		},
		sort: courseSortComparatorFunc,
		split: splitBySemester
	}
];
