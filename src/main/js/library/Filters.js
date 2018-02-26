import Logger from 'nti-util-logger';
import {scoped} from 'nti-lib-locale';
import naturalSort from 'node-natural-sort';

export const CURRENT = 'current';
export const UPCOMING = 'upcoming';
export const ARCHIVED = 'archived';

const logger = Logger.get('library:Filters');

const getLabel = scoped('library.category', {
	current: 'Current',
	upcoming: 'Upcoming',
	archived: 'Archived',
	archivedGroup: {
		0: 'January %(year)s',
		1: 'Febuary %(year)s',
		2: 'March %(year)s',
		3: 'April %(year)s',
		4: 'May %(year)s',
		5: 'June %(year)s',
		6: 'July %(year)s',
		7: 'August %(year)s',
		8: 'September %(year)s',
		9: 'October %(year)s',
		10: 'November %(year)s',
		11: 'December %(year)s',
		'not-set': ' ',
	}
});

function courseSortComparatorFunc (a, b) {
	const strComp = naturalSort({caseSensitive: false});

	return strComp((a || {}).ProviderUniqueID, (b || {}).ProviderUniqueID)
		|| strComp((a || {}).title, (b || {}).title);
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
			let key = `archivedGroup.${start ? start.getMonth() : 'not-set'}`;
			let bin = getLabel(key, {year: start ? start.getFullYear() : ' '});

			add(start, bin, item);

		} catch (e) {
			logger.error(e);
		}
	});


	bins = Object.values(bins);
	bins.sort((a, b)=>b.sort - a.sort);

	return bins;
}


const isUpcoming = item => item.getStartDate() > Date.now();
const isArchived = item => (item = item.getEndDate(), item && item < Date.now());
const isCurrent = item => !isArchived(item) && !isUpcoming(item);

export default [
	{
		name: getLabel(UPCOMING),
		kind: UPCOMING,

		test: item => {
			try {
				return isUpcoming(item);
			}
			catch(e) {
				logger.error('Filtering out bad Item: %o, because: %s', item,  e.message || e);
				return false;
			}
		},
		sort: courseSortComparatorFunc,
		split: splitBySemester
	},
	{
		name: getLabel(CURRENT),
		kind: CURRENT,
		test: item => {
			try {
				return isCurrent(item);
			}
			catch(e) {
				logger.error('Filtering out bad Item: %o, because: %s', item,  e.message || e);
				return false;
			}
		},
		sort: courseSortComparatorFunc
	},
	{
		name: getLabel(ARCHIVED),
		kind: ARCHIVED,
		test: item => {
			try {
				return isArchived(item);
			}
			catch(e) {
				logger.error('Filtering out bad Item: %o, because: %s', item,  e.message || e);
				return false;
			}
		},
		sort: courseSortComparatorFunc,
		split: splitBySemester
	}
];
