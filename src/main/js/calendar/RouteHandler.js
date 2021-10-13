import { join } from 'path';


import Logger from '@nti/util-logger';
import { Models } from '@nti/lib-interfaces';
import { encodeForURI } from '@nti/lib-ntiids';
import { Prompt } from '@nti/web-commons';
import { GotoWebinar } from '@nti/web-integrations';

const logger = Logger.get('app:calendar:route-handler');

const {
	calendar: {
		CalendarEventRef: { MimeType: CalendarEventRefType },
		CourseCalendarEvent: { MimeType: CourseEventType },
		AssignmentCalendarEvent: { MimeType: AssignmentEventType },
		WebinarCalendarEvent: { MimeType: WebinarEventType },
	},
	integrations: {
		Webinar: { MimeType: WebinarType },
		WebinarAsset: { MimeType: WebinarAssetType },
	},
} = Models;

const UNKNOWN = ({ MimeType } = {}) =>
	logger.warn(`No handler for MimeType: '${MimeType}'`);

function webinarHandler(webinar, context) {
	return () => {
		if (webinar.hasLink('WebinarRegister')) {
			Prompt.modal(
				<GotoWebinar.Registration
					item={{ webinar }}
					onBeforeDismiss={() => {}}
					dialog={false}
				/>
			);
		} else if (webinar.hasLink('JoinWebinar')) {
			window.open(webinar.getLink('JoinWebinar'), '_blank');
		}
	};
}

function webinarUnavailable(obj) {
	if (!obj.hasLink('JoinWebinar') && !obj.hasLink('WebinarRegister')) {
		return () => {
			Prompt.alert('This webinar is no longer available');
		};
	}
}

const HANDLERS = {
	[CourseEventType]: (obj, context) =>
		join(
			context === 'goto'
				? 'object'
				: window.location.pathname + '#/calendar/',
			encodeForURI(obj.getID())
		),

	[CalendarEventRefType]: (obj, context) =>
		HANDLERS[CourseEventType](obj.CalendarEvent, context),

	[AssignmentEventType]: ({ AssignmentNTIID }, { courseNTIID }) =>
		join(
			'course',
			encodeForURI(courseNTIID),
			'assignments',
			encodeForURI(AssignmentNTIID)
		),

	[WebinarType]: (webinar, context) =>
		webinarUnavailable(webinar) || webinarHandler(webinar, context),
	[WebinarAssetType]: ({ webinar }, context) =>
		webinarUnavailable(webinar) || webinarHandler(webinar, context),

	[WebinarEventType]: (obj, context) => {
		const unavailable = webinarUnavailable(obj);

		if (unavailable) {
			return unavailable;
		}

		const webinarId = obj.getLinkProperty('Webinar', 'ntiid');

		if (webinarId) {
			return async () => {
				const webinar = await obj.fetchLink('Webinar');
				return webinarHandler(webinar, context)();
			};
		}

		logger.warn(
			"Unable to route webinar event. No 'Webinar' link ntiid?",
			obj
		);
	},
};

export const getRouteFor = (obj, context) => {
	return (HANDLERS[(obj || {}).MimeType] || UNKNOWN)(obj, context);
};
