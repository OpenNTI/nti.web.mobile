import Filters from '../Filters';
import LibraryAccessor from './LibraryAccessor';

const sectionNames = {
	courses: 'courses',
	books: 'books'
};


const sectionPropertyMap = {
	[sectionNames.courses]: ['administeredCourses','courses'],
	[sectionNames.books]: ['bundles','packages']
};


const sectionFiltersMap = {
	[sectionNames.courses]: Filters,
	[sectionNames.books]: [{name: 'Books'}]
};


export default {
	mixins: [LibraryAccessor],

	getSectionNames () {
		return Object.keys(sectionNames);
	},


	getListForSection (section) {
		var library = this.getLibrary();
		var properties = sectionPropertyMap[section];
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


	getFiltersForSection (section) {
		return sectionFiltersMap[section];
	},


	getBinnedData () {

		let sections = this.getSectionNames();
		let bins = [];

		sections.forEach(s=> {
			let filters = this.getFiltersForSection(s);
			let items = this.getListForSection(s) || [];
			if (filters) {
				filters.forEach(f=> {
					bins.push({
						name: f.name,
						items: f.filter ? items.filter(f.filter) : items
					});
				});
			} else {
				bins.push({items});
			}
			return bins;
		});

		return bins.filter(b=>b.items && b.items.length > 0);
	}
};
