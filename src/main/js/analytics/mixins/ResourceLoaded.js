import AnalyticsActions from '../Actions';
import AnalyticsStore from '../Store';
import {RESUME_SESSION} from '../Constants';
import ResourceEvent from 'nti.lib.interfaces/models/analytics/ResourceEvent';
import TopicViewedEvent from 'nti.lib.interfaces/models/analytics/TopicViewedEvent';
import {RESOURCE_VIEWED, TOPIC_VIEWED} from 'nti.lib.interfaces/models/analytics/MimeTypes';
import {decodeFromURI} from 'nti.lib.interfaces/utils/ntiids';

export const onStoreChange = 'ResourceLoaded:onStoreChange';

// const StoreChange = Symbol('ResourceLoaded:StoreChange');

// keep track of the view start event so we can push analytics including duration
let currentEvent = null;

let typeMap = {
	[RESOURCE_VIEWED]: ResourceEvent,
	[TOPIC_VIEWED]: TopicViewedEvent
};



module.exports = {

	componentDidMount() {
		AnalyticsStore.addChangeListener(this[onStoreChange]);
	},

	componentWillUnmount() {
		AnalyticsStore.removeChangeListener(this[onStoreChange]);
	},

	[onStoreChange](event) {
		if (event.type === RESUME_SESSION) {
			console.log(event);
			if (this.resumeAnalyticsEvents) {
				this.resumeAnalyticsEvents();
			}
			else {
				console.warn('Components using ResourceLoaded mixin should implement resumeAnalyticsEvents. (Check %s)', this.constructor.displayName);
			}
		}
	},

	resourceLoaded (resourceId, courseId, eventMimeType) {
		if (currentEvent) {
			this.resourceUnloaded();
		}

		// wait for resourceUnloaded to finish before creating the
		// new event so we don't change currentEvent out from under it.
		let p = currentEvent ? this.resourceUnloaded() : Promise.resolve();
		p.then(() => {
			let Type = typeMap[eventMimeType] || ResourceEvent;
			currentEvent = new Type(
					decodeFromURI(resourceId),
					courseId);
			AnalyticsActions.emitEventStarted(currentEvent);
		});
	},

	resourceUnloaded: function() {
		if (!currentEvent || currentEvent.finished) {
			return Promise.resolve();
		}

		let resourceId = currentEvent.resourceId;
		currentEvent.finish();

		let contextFunction = this.analyticsContext || this.resolveContext;
		return contextFunction(this.props)
			.then(context => {
				let first = context[0],
					last = context[context.length -1];

				//if the end of the path is the resourceId (it should) then drop it.
				last = (last && (last.ntiid === resourceId || last === resourceId)) ? -1 : undefined;
				if (!last) {
					console.error('The last entry in the context path is not the resource.');
				}

				first = (typeof first === 'object' && !first.ntiid) ? 1 : 0;
				if (first) {
					console.warn('Context "root" has no ntiid, omitting: %o', context);
				}

				if (first || last) {
					context = context.slice(first, last);
				}

				currentEvent.setContextPath(context
					.map(x=> x.ntiid || (typeof x === 'string'? x: null))
					.filter(x=>x));
				AnalyticsActions.emitEventEnded(currentEvent);
				currentEvent = null;
			});
	}

};
