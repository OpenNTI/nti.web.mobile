import AnalyticsActions from '../Actions';
import AnalyticsStore from '../Store';
import {RESUME_SESSION} from '../Constants';
import ResourceEvent from 'dataserverinterface/models/analytics/ResourceEvent';
import TopicViewedEvent from 'dataserverinterface/models/analytics/TopicViewedEvent';
import {RESOURCE_VIEWED, TOPIC_VIEWED} from 'dataserverinterface/models/analytics/MimeTypes';
import NTIID from 'dataserverinterface/utils/ntiids';

// const StoreChange = Symbol('ResourceLoaded:StoreChange');

// keep track of the view start event so we can push analytics including duration
let currentEvent = null;

let typeMap = {
	[RESOURCE_VIEWED]: ResourceEvent,
	[TOPIC_VIEWED]: TopicViewedEvent
};



module.exports = {

	componentDidMount() {
		AnalyticsStore.addChangeListener(this.__onStoreChange);
	},

	componentWillUnmount() {
		AnalyticsStore.removeChangeListener(this.__onStoreChange);
	},

	__onStoreChange(event) {
		if (event.type === RESUME_SESSION) {
			console.log(event);
			this.resumeAnalyticsEvents();
		}
	},

	resumeAnalyticsEvents() {
		console.warn('Components using ResourceLoaded mixin should override resumeAnalyticsEvents. (Check %s)', this.constructor.displayName);
	},

	_resourceLoaded (resourceId, courseId, eventMimeType) {
		if (currentEvent) {
			this._resourceUnloaded();
		}

		// wait for _resourceUnloaded to finish before creating the
		// new event so we don't change currentEvent out from under it.
		let p = currentEvent ? this._resourceUnloaded() : Promise.resolve();
		p.then(() => {
			let Type = typeMap[eventMimeType] || ResourceEvent;
			currentEvent = new Type(
					NTIID.decodeFromURI(resourceId),
					courseId);
			AnalyticsActions.emitEventStarted(currentEvent);
		});
	},

	_resourceUnloaded: function() {
		if (!currentEvent || currentEvent.finished) {
			return Promise.resolve();
		}

		let resourceId = currentEvent.resourceId;
		currentEvent.finish();

		var contextFunction = this.analyticsContext || this.resolveContext;
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
