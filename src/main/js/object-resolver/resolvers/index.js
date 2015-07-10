import CourseObjects from './CourseObjects';
import ForumObjects from './ForumObjects';
import OutlineNodes from './OutlineNodes';
import LibraryPath from './LibraryPath';

const handlers = [
	CourseObjects,
	ForumObjects,
	OutlineNodes,
	LibraryPath
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
