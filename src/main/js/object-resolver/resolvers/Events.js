import React from 'react';
import {Models} from '@nti/lib-interfaces';
import {Prompt} from '@nti/web-commons';
import {Event} from '@nti/web-calendar';

const {
	CourseCalendarEvent: {MimeType: CourseEventType},
	AssignmentCalendarEvent: {MimeType: AssignmentEventType},
	WebinarCalendarEvent: {MimeType: WebinarEventType}
} = Models.calendar;

const HANDLERS = {
	[CourseEventType]: (event) => {
		Prompt.modal(
			<Event.View
				getAvailableCalendars={() => []}
				event={event}
				nonDialog
			/>
		);

		return '/';
	},
	[AssignmentEventType]: () => {
		return '/';//I don't think we hit this
	},
	[WebinarEventType]: () => {
		return '/';// I don't think we hit this
	}
};

export default class EventPathResolver {
	static handles (o) {
		return HANDLERS[(o || {}).MimeType];
	}

	static resolve (o) {
		return new EventPathResolver(o).getPath();
	}

	constructor (o) {
		this.event = o;
	}


	getPath () {
		const handler = this.event ? HANDLERS[this.event.MimeType] : null;

		if (!handler) { throw new Error('Unknown Event Type'); }

		return handler(this.event);
	}
}
