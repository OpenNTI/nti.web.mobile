import CourseObjects from './CourseObjects';
import Entities from './Entities';
import LibraryPath from './LibraryPath';
import ContentPages from './RandomContentPages';

const handlers = [
	CourseObjects,
	Entities,
	LibraryPath,
	ContentPages
];


export function getHandler (o) {

	for (let handler of handlers) {
		if (handler.handles && handler.handles(o)) {
			return handler;
		}
	}

}


export function resolve (object) {
	let handler = getHandler(object);
	if (!handler) {
		console.warn('No Handler for object: ', object);
		return Promise.resolve('/');
	}

	return handler.resolve(object);
}
