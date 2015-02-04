import {load} from './Actions';
import Store from './Store';

var sectionNames = {
	admin: 'admin',
	courses: 'courses',
	books: 'books',
	catalog: 'catalog'
};


export function getSectionNames () {
	return Object.keys(sectionNames);
}

export function defaultSection () {
	return load().then(() => {
		var data = Store.getData();
		var courses = data.courses || [];
		// if user doesn't have any courses default to the catalog.
		return courses.length > 0 ? sectionNames.courses : sectionNames.catalog;
	});
}
