'use strict';

 function VideoEvent(sourceEvent, context) {
 	this.type = sourceEvent.type;
	this.timestamp = sourceEvent.timeStamp;
	this.courseid = null;
	this.contextpath = context;
	this.path = document.location.pathname;
	this.resourceid = null;
	this.timing = {
		start: sourceEvent.target.currentTime,
		end: sourceEvent.target.currentTime
	};
	this.with_transcript = false;
	this.sourceEvent = sourceEvent;
}

module.exports.VideoEvent = VideoEvent;
