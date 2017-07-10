import Logger from 'nti-util-logger';
import naturalSort from 'node-natural-sort';

import Filters from '../Filters';

import LibraryAccessor from './LibraryAccessor';


const stringCompare = naturalSort({caseSensitive: false});

const logger = Logger.get('library:mixins:SectionAware');

//the keys and values must match.
const SECTION_NAMES = { admin: 'admin', courses: 'courses', books: 'books' };


const SECTION_PROPERTY_MAP = {
	[SECTION_NAMES.admin]: 'administeredCourses',
	[SECTION_NAMES.courses]: 'courses',
	[SECTION_NAMES.books]: 'bundles'
};


const SECTION_FILTERS_MAP = {
	[SECTION_NAMES.admin]: Filters,
	[SECTION_NAMES.courses]: Filters,
	[SECTION_NAMES.books]: [{
		// name: 'Books',
		sort: (a, b) => stringCompare((a || {}).title, (b || {}).title)
	}]
};


export default {
	mixins: [LibraryAccessor],


	getListForSection (section) {
		let library = this.getLibrary();
		let properties = SECTION_PROPERTY_MAP[SECTION_NAMES[section]];
		if (!library) {
			return [];//not loaded yet
		}

		if (!properties) {
			logger.error('Unknown section; returning empty array.');
			return [];
		}

		if (!Array.isArray(properties)) {
			properties = [properties];
		}

		return properties
			.map(p=>library[p])
			.reduce((a, l)=>a.concat(l), []);
	},



	getBinnedData (section) {
		let bins = [];
		let filters = SECTION_FILTERS_MAP[section];
		let items = this.getListForSection(section) || [];

		let cap = x => x ? (x[0].toUpperCase() + x.slice(1)) : 'Unknown';

		let getBin = o => ({
			name: o.name,
			['is' + cap(o.kind)]: true,
			items: (o.test ? items.filter(o.test) : items).sort(o.sort || (()=>0))
		});

		if (filters) {
			filters.forEach(f=> {
				let b = getBin(f);
				if (f.split) {
					f.split(b.items).forEach(x=>bins.push(Object.assign({}, b, x, {name: f.name})));
				} else {
					bins.push(b);
				}
			});

		} else {
			bins.push({items});
		}


		return bins.filter(b=>b.items && b.items.length > 0);
	}
};
