import Logger from 'nti-util-logger';
import {getModel} from 'nti-lib-interfaces';

const ResourceEvent = getModel('analytics.resourceevent');

import {decodeFromURI} from 'nti-lib-ntiids';

import {emitEventStarted, emitEventEnded} from '../Actions';
import AnalyticsStore from '../Store';
import {RESUME_SESSION} from '../Constants';
import {toAnalyticsPath} from '../utils';

export const onStoreChange = 'ResourceLoaded:onStoreChange';

const logger = Logger.get('mixin:resourceLoaded');

// keep track of the view start event so we can push analytics including duration
const CURRENT_EVENT = Symbol('CurrentEvent');


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
				logger.warn('Components using ResourceLoaded mixin should implement resumeAnalyticsEvents. (Check %s)', this.constructor.displayName);
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

			const Type = getModel(eventMimeType) || ResourceEvent;
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
