import React from 'react';
import Logger from '@nti/util-logger';
import {Models} from '@nti/lib-interfaces';
import {encodeForURI} from '@nti/lib-ntiids';
import {Prompt} from '@nti/web-commons';
import {Event} from '@nti/web-calendar';
import {GotoWebinar} from '@nti/web-integrations';

const logger = Logger.get('app:calendar:route-handler');

const {
	CalendarEventRef: {MimeType: CalendarEventRefType},
	CourseCalendarEvent: {MimeType: CourseEventType},
	AssignmentCalendarEvent: {MimeType: AssignmentEventType},
	WebinarCalendarEvent: {MimeType: WebinarEventType}
} = Models.calendar;

const UNKNOWN = ({MimeType} = {}) => logger.warn(`No handler for MimeType: '${MimeType}'`);

function modalEventView (event, context) {
	return () => Prompt.modal(<Event.View
		getAvailableCalendars={() => []}
		event={event}
		nonDialog
	/>);
}

const HANDLERS = {
	[CourseEventType]: (obj, context) => modalEventView(obj, context),

	[CalendarEventRefType]: (obj, context) => modalEventView(obj.CalendarEvent, context),

	[AssignmentEventType]: ({AssignmentNTIID}, {courseNTIID}) => {
		return `mobile/course/${encodeForURI(courseNTIID)}/assignments/${encodeForURI(AssignmentNTIID)}`;
	},

	[WebinarEventType]: (obj, context) => {
		if(!obj.hasLink('JoinWebinar') && !obj.hasLink('WebinarRegister')) {
			return () => {
				Prompt.alert('This webinar is no longer available');
			};
		}

		const webinarLinkObj = obj.Links.filter(x=>x.rel === 'Webinar')[0];
		const webinarID = webinarLinkObj && webinarLinkObj.ntiid;

		if(webinarID) {
			return async () => {
				const webinar = await obj.fetchLinkParsed('Webinar');

				if(webinar.hasLink('WebinarRegister')) {
					Prompt.modal(<GotoWebinar.Registration
						item={{webinar}}
						onBeforeDismiss={()=>{}}
						nonDialog
					/>);
				}
				else if(webinar.hasLink('JoinWebinar')) {
					window.open(webinar.getLink('JoinWebinar'), '_blank');
				}
			};
		}
	}
};

export const getRouteFor = (obj, context) => {
	return (HANDLERS[(obj || {}).MimeType] || UNKNOWN)(obj, context);
};
