import keyMirror from 'react/lib/keyMirror';
import Filters from '../Filters';
import LibraryAccessor from './LibraryAccessor';

const SECTION_NAMES = keyMirror({ admin: null, courses: null, books: null });


const SECTION_PROPERTY_MAP = {
	[SECTION_NAMES.admin]: 'administeredCourses',
	[SECTION_NAMES.courses]: 'courses',
	[SECTION_NAMES.books]: ['bundles', 'packages']
};


const SECTION_FILTERS_MAP = {
	[SECTION_NAMES.admin]: Filters,
	[SECTION_NAMES.courses]: Filters,
	[SECTION_NAMES.books]: [{
		// name: 'Books',
		sort: (a, b) => ((a || {}).title || '').localeCompare((b || {}).title)
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
			console.error('Unknown section; returning empty array.');
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
					f.split(b.items).forEach(x=>bins.push(Object.assign(x, {name: f.name})));
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
