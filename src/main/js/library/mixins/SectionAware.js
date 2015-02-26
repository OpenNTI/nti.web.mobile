import Filters from '../Filters';
import LibraryAccessor from './LibraryAccessor';

const sectionNames = {
	admin: 'admin',
	courses: 'courses',
	books: 'books'
};


const sectionPropertyMap = {
	[sectionNames.admin]: 'administeredCourses',
	[sectionNames.courses]: 'courses',
	[sectionNames.books]: ['bundles','packages']
};


const sectionFiltersMap = {
	[sectionNames.admin]: Filters,
	[sectionNames.courses]: Filters,
	[sectionNames.books]: [{name: 'Books'}]
};


export default {
	mixins: [LibraryAccessor],

	getSectionNames () {
		return Object.keys(sectionNames);
	},


	defaultSection () {
		return this.ensureLibraryLoaded()
			.then(() => {
				if (!this.getLibrary()) {
					console.warn('Early!!!');
				}
				var admin = this.getListForSection(sectionNames.admin);
					//if there are admin courses, default there...
				return admin.length ? sectionNames.admin :
					// if user doesn't have any courses default to the catalog.
						sectionNames.courses;
			});
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


	getBinnedData (section) {
		let bins = [];
		let filters = this.getFiltersForSection(section);
		let items = this.getListForSection(section) || [];

		let getBin = o => ({
			name: o.name,
			items: o.filter ? items.filter(o.filter) : items
		});

		if (filters) {
			filters.forEach(f=> {
				let b = getBin(f);
				if (f.split){
					f.split(b.items).forEach(b=>bins.push(Object.assign(b,{name: f.name})));
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
