'use strict';

var Analytics = require('analytics');
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

		var event = new Type(
				currentResource.resourceId,
				currentResource.courseId,
				(Date.now() - currentResource.loaded)/1000);

		if (event.getDuration() > MINIMUM_EVENT_DURATION_SECONDS) {
			var contextFunction = this.analyticsContext || this.props.contextProvider;
			contextFunction(this.props)
				.then(context => {
					event.setContextPath(context.map(x=>x.ntiid || x));
					Analytics.Actions.emitEvent(event);
				});
		}

		currentResource = null;
	}

};
