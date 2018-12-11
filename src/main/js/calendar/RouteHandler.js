import React from 'react';
import {Models} from '@nti/lib-interfaces';
import {encodeForURI} from '@nti/lib-ntiids';
import {Prompt} from '@nti/web-commons';
import {Event} from '@nti/web-calendar';
import {GotoWebinar} from '@nti/web-integrations';

export const getRouteFor = (obj, context) => {
	if(obj.MimeType === Models.calendar.CourseCalendarEvent.MimeType) {
		return () => {
			Prompt.modal(<Event.View
				getAvailableCalendars={() => []}
				event={obj}
			/>);
		};
	}
	else if(obj.MimeType === Models.calendar.AssignmentCalendarEvent.MimeType) {
		const {courseNTIID} = context;
		const {AssignmentNTIID} = obj;

		return `mobile/course/${encodeForURI(courseNTIID)}/assignments/${encodeForURI(AssignmentNTIID)}`;
	}
	else if(obj.MimeType === Models.calendar.WebinarCalendarEvent.MimeType) {
		if(obj.hasLink('JoinWebinar')) {
			let testAnchor = document.createElement('a');
			testAnchor.href = obj.getLink('JoinWebinar');

			return testAnchor.href;
		}

		if(!obj.hasLink('JoinWebinar') && !obj.hasLink('WebinarRegister')) {
			return () => {
				Prompt.alert('This webinar is no longer available');
			};
		}

		const webinarLinkObj = obj.Links.filter(x=>x.rel === 'Webinar')[0];
		const webinarID = webinarLinkObj && webinarLinkObj.ntiid;

		if(webinarID) {
			return () => {
				Prompt.modal(<GotoWebinar.Registration
					item={{webinar:obj}}
					onBeforeDismiss={()=>{}}
					nonDialog
				/>);
			};
		}
	}
};
