'use strict';

var AnalyticsActions = require('analytics/Actions');
var ResourceEvent = require('dataserverinterface/models/analytics/ResourceEvent');
var TopicViewedEvent = require('dataserverinterface/models/analytics/TopicViewedEvent');
var {RESOURCE_VIEWED, TOPIC_VIEWED} = require('dataserverinterface/models/analytics/MimeTypes');
var NTIID = require('dataserverinterface/utils/ntiids');

// keep track of the view start event so we can push analytics including duration
var currentResource = null;

var MINIMUM_EVENT_DURATION_SECONDS = 1;

var typeMap = {
	[RESOURCE_VIEWED]: ResourceEvent,
	[TOPIC_VIEWED]: TopicViewedEvent
};

module.exports = {

	_resourceLoaded: function(resourceId, courseId, eventMimeType) {
		if (currentResource) {
			this._resourceUnloaded();
		}

		// keep track of this for sending analytics
		currentResource = {
			mimeType: eventMimeType || RESOURCE_VIEWED,
			resourceId: NTIID.decodeFromURI(resourceId),
			loaded: Date.now(),
			courseId: courseId || (this.props.course && this.props.course.getID())
		};
	},

	_resourceUnloaded: function() {
		if (!currentResource) {
			return;
		}

		var Type = typeMap[currentResource.mimeType] || ResourceEvent;
		var resourceId = currentResource.resourceId;

		var event = new Type(
				resourceId,
				currentResource.courseId,
				(Date.now() - currentResource.loaded)/1000);

		if (event.getDuration() > MINIMUM_EVENT_DURATION_SECONDS) {
			var contextFunction = this.analyticsContext || this.props.contextProvider;
			contextFunction(this.props)
				.then(context => {
					let first = context[0],
						last = context[context.length -1];

					//if the end of the path is the resourceId (it should) then drop it.
					last = (last.ntiid === resourceId || last === resourceId) ? -1 : undefined;
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


					event.setContextPath(context.map(x=>x.ntiid || x));
					AnalyticsActions.emitEvent(event);
				});
		}

		currentResource = null;
	}

};
