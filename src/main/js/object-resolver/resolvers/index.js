import Logger from '@nti/util-logger';

import AssignmentObjects from './AssignmentObjects';
import CourseObjects from './CourseObjects';
import Entities from './Entities';
import Events from './Events';
import LibraryPath from './LibraryPath';
import RandomContentPages from './RandomContentPages';

const handlers = [
	AssignmentObjects,
	CourseObjects,
	Events,
	Entities,
	LibraryPath,
	RandomContentPages,
];

const logger = Logger.get('object-resolver:resolvers');

export function getHandler(o) {
	for (let handler of handlers) {
		if (handler.handles && handler.handles(o)) {
			return handler;
		}
	}
}

export function resolve(object) {
	let handler = getHandler(object);
	if (!handler) {
		logger.warn('No Handler for object: ', object);
		return Promise.resolve('/');
	}

	return handler.resolve(object);
}
