import {getModel} from 'nti.lib.interfaces';

const AssessmentEvent = getModel('analytics.assessmentevent');
const AssignmentEvent = getModel('analytics.assignmentevent');
const ResourceEvent = getModel('analytics.resourceevent');
const TopicViewedEvent = getModel('analytics.topicviewedevent');
const ProfileViewedEvent = getModel('analytics.profileviewevent');
const ProfileActivityViewedEvent = getModel('analytics.profileactivityviewevent');
const ProfileMembershipViewedEvent = getModel('analytics.profilemembershipviewevent');

import {decodeFromURI} from 'nti.lib.interfaces/lib/utils/ntiids';
import {
	ASSIGNMENT_VIEWED,
	RESOURCE_VIEWED,
	SELFASSESSMENT_VIEWED,
	TOPIC_VIEWED,
	PROFILE_VIEWED,
	PROFILE_ACTIVITY_VIEWED,
	PROFILE_MEMBERSHIP_VIEWED
} from 'nti.lib.interfaces/lib/models/analytics/MimeTypes';

import {emitEventStarted, emitEventEnded} from '../Actions';
import AnalyticsStore from '../Store';
import {RESUME_SESSION} from '../Constants';
import {toAnalyticsPath} from '../utils';

export const onStoreChange = 'ResourceLoaded:onStoreChange';

// keep track of the view start event so we can push analytics including duration
const CURRENT_EVENT = Symbol('CurrentEvent');

const typeMap = {
	[ASSIGNMENT_VIEWED]: AssignmentEvent,
	[SELFASSESSMENT_VIEWED]: AssessmentEvent,
	[RESOURCE_VIEWED]: ResourceEvent,
	[TOPIC_VIEWED]: TopicViewedEvent,
	[PROFILE_VIEWED]: ProfileViewedEvent,
	[PROFILE_ACTIVITY_VIEWED]: ProfileActivityViewedEvent,
	[PROFILE_MEMBERSHIP_VIEWED]: ProfileMembershipViewedEvent
};


export default {

	componentDidMount () {
		AnalyticsStore.addChangeListener(this[onStoreChange]);
	},

	componentWillUnmount () {
		AnalyticsStore.removeChangeListener(this[onStoreChange]);
	},

	[onStoreChange] (event) {
		if (event.type === RESUME_SESSION) {
			if (this.resumeAnalyticsEvents) {
				this.resumeAnalyticsEvents();
			}
			else {
				console.warn('Components using ResourceLoaded mixin should implement resumeAnalyticsEvents. (Check %s)', this.constructor.displayName);
			}
		}
	},

	resourceLoaded (resourceId, courseId, eventMimeType) {
		if (this[CURRENT_EVENT]) {
			this.resourceUnloaded();
		}

		let assessmentId;
		if (arguments.length > 3) {
			[assessmentId, resourceId, courseId, eventMimeType] = arguments;
		}

		// wait for resourceUnloaded to finish before creating the
		// new event so we don't change this[CURRENT_EVENT] out from under us.
		this.resourceUnloaded().then(() => {

			let Type = typeMap[eventMimeType] || ResourceEvent;
			this[CURRENT_EVENT] = new Type(
				decodeFromURI(resourceId),
				courseId,
				assessmentId);

			emitEventStarted(this[CURRENT_EVENT]);
		});
	},

	resourceUnloaded () {
		if (!this[CURRENT_EVENT] || this[CURRENT_EVENT].finished) {
			return Promise.resolve();
		}

		let resourceId = this[CURRENT_EVENT].resourceId;
		this[CURRENT_EVENT].finish();

		let contextFunction = this.analyticsContext || this.resolveContext;
		return contextFunction(this.props)
			.then(context => {

				this[CURRENT_EVENT].setContextPath(toAnalyticsPath(context, resourceId));

				emitEventEnded(this[CURRENT_EVENT]);

				this[CURRENT_EVENT] = null;
			});
	}

};
