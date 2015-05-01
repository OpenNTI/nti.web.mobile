import ResourceEvent from 'nti.lib.interfaces/models/analytics/ResourceEvent';
import TopicViewedEvent from 'nti.lib.interfaces/models/analytics/TopicViewedEvent';
import {decodeFromURI} from 'nti.lib.interfaces/utils/ntiids';
import {
	RESOURCE_VIEWED,
	TOPIC_VIEWED
} from 'nti.lib.interfaces/models/analytics/MimeTypes';

import {emitEventStarted, emitEventEnded} from '../Actions';
import AnalyticsStore from '../Store';
import {RESUME_SESSION} from '../Constants';
import {toAnalyticsPath} from '../utils';

export const onStoreChange = 'ResourceLoaded:onStoreChange';

// keep track of the view start event so we can push analytics including duration
const CURRENT_EVENT = Symbol('CurrentEvent');

const typeMap = {
	[RESOURCE_VIEWED]: ResourceEvent,
	[TOPIC_VIEWED]: TopicViewedEvent
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

		// wait for resourceUnloaded to finish before creating the
		// new event so we don't change this[CURRENT_EVENT] out from under us.
		let p = this[CURRENT_EVENT] ? this.resourceUnloaded() : Promise.resolve();
		p.then(() => {
			let Type = typeMap[eventMimeType] || ResourceEvent;
			this[CURRENT_EVENT] = new Type(
					decodeFromURI(resourceId),
					courseId);
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
