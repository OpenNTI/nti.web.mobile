'use strict';

var Analytics = require('analytics');
var ResourceEvent = require('dataserverinterface/models/analytics/ResourceEvent');

// keep track of the view start event so we can push analytics including duration
var currentResource = null;

var MINIMUM_EVENT_DURATION_SECONDS = 1;

module.exports = {

	_getEventData: function() {
		return {
			timestamp: Date.now(),
			pageId: this.getPageID(),
			outlineId: this.props.outlineId,
			rootId: this.props.rootId
		};
	},


	_resourceLoaded: function(resourceId) {
		if (currentResource) {
			this._resourceUnloaded();
		}

		// keep track of this for sending analytics
		currentResource = {
			resourceId: resourceId,
			loaded: Date.now()
		};
	},


	_resourceUnloaded: function() {
		if (!currentResource) {
			return;
		}

		var event = new ResourceEvent(
				currentResource.resourceId,
				this.props.course && this.props.course.getID(),
				(Date.now() - currentResource.loaded)/1000);

		if (event.getDuration() > MINIMUM_EVENT_DURATION_SECONDS) {
			this.props.contextProvider(this.props)
				.then(context => {
					event.setContextPath(context.map(x=>x.ntiid));
					Analytics.Actions.emitEvent(Analytics.Constants.VIEWER_EVENT, event);
				});
		}

		currentResource = null;
	}

};
