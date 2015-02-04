import Filters from '../Filters';
import LibraryAccessor from './LibraryAccessor';

const sectionNames = {
	admin: 'admin',
	courses: 'courses',
	books: 'books',
	catalog: 'catalog'
};


const sectionPropertyMap = {
	[sectionNames.admin]: 'administeredCourses',
	[sectionNames.courses]: 'courses',
	[sectionNames.books]: ['bundles','packages']
};


const sectionFiltersMap = {
	[sectionNames.admin]: Filters,
	[sectionNames.courses]: Filters,
	[sectionNames.books]: null
};


export default {
	mixins: [LibraryAccessor],

	getSectionNames () {
		return Object.keys(sectionNames);
	},


	defaultSection () {
		return this.ensureLibraryLoaded()
			.then(() => {
				var admin = this.getListForSection(sectionNames.admin);
				var courses = this.getListForSection(sectionNames.courses);

					//if there are admin courses, default there...
				return admin.length ? sectionNames.admin :
					// if user doesn't have any courses default to the catalog.
						courses.length ? sectionNames.courses :
						sectionNames.catalog;
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
	}
};
