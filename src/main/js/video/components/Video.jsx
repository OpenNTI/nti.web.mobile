/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var Providers = require('../services');

var Model = require('dataserverinterface/models/Video');
var WatchVideoEvent = require('dataserverinterface/models/analytics/WatchVideoEvent');
var call = require('dataserverinterface/utils/function-call');

var actions = require('../Actions');

// keep track of the play start event so we can push analytics including duration
// when the video is paused, stopped, seeked, or ends.
var _playStartEvent = null;

module.exports = React.createClass({
	displayName: 'Video',

	propTypes: {
		/**
		 * The Video source. Either a URL or a Video model.
		 * @type {String/Video}
		 */
		src: React.PropTypes.oneOfType([
			React.PropTypes.string,
			React.PropTypes.instanceOf(Model)
			]).isRequired,

		/**
		* An array of ntiids reflecting the current course/node/etc.
		*/
		context: React.PropTypes.array.isRequired,

		/**
		 * @callback onTimeUpdate
		 * @param {float} time - the position in the video in seconds. (float)
		 */

		/**
		 * Callback for time updates as video plays back.
		 *
		 * @type {onTimeUpdate}
		 */
		onTimeUpdate: React.PropTypes.func,
		onSeeked: React.PropTypes.func,
		onPlaying: React.PropTypes.func,
		onPause: React.PropTypes.func,
		onEnded: React.PropTypes.func
	},

	getDefaultProps: function() {
		return {
			context:[]
		};
	},


	_getEventData: function(event) {
		return {
			timestamp: event.timeStamp,
			target: event.target,
			currentTime: event.target.currentTime,
			type: event.type
		};
	},


	_playbackStarted: function(event) {
		if (_playStartEvent) {
			console.warn('We already have a playStartEvent. How did we get another one without a ' +
						'pause/stop/seek/end in between? Dropping previous start event on the floor.');
		}
		_playStartEvent = this._getEventData(event);

	},


	_playbackStopped: function(event) {
		if (!_playStartEvent) {
			console.warn('We don\'t have a playStartEvent? How did we get a stop event without a prior start event? Dropping the event on the floor.');
			return;
		}
		var _playEndEvent = this._getEventData(event);

		this._emit(_playStartEvent,_playEndEvent);
		_playStartEvent = null;
	},


	_emit: function(startEvent,endEvent) {
		var rootContextId = this.props.context.length > 0 ? this.props.context[0] : null;
		var even = new WatchVideoEvent(
				this.props.src.ntiid,
				rootContextId,
				this.props.context,
				(endEvent.currentTime - startEvent.currentTime),
				startEvent.currentTime,
				endEvent.currentTime,
			 	!!this.props.transcript
			);

		actions.emitVideoEvent(even);
	},


	onTimeUpdate: function(event) {
		// this._emit(event);
		call(this.props.onTimeUpdate,event);
	},


	onSeeked: function(event) {
		// this._emit(event);
		call(this.props.onSeeked,event);
	},


	onPlaying: function(event) {
		this._playbackStarted(event);
		call(this.props.onPlaying,event);
	},


	onPause: function(event) {
		this._playbackStopped(event);
		call(this.props.onPause,event);
	},


	onEnded: function(event) {
		this._playbackStopped(event);
		call(this.props.onEnded,event);
	},


	play: function () {
		this.refs.activeVideo.play();
	},


	pause: function () {
		this.refs.activeVideo.pause();
	},


	stop: function () {
		this.refs.activeVideo.stop();
	},


	setCurrentTime: function(time) {
		this.refs.activeVideo.setCurrentTime(time);
	},


	render: function() {
		var video = this.props.src;
		var Provider = Providers.getHandler(video) || React.DOM.div;
		var videoSource = video && (video.sources || {})[0];

		var props = {
			ref: 'activeVideo',
			// src: typeof video === 'string' && video,
			source: videoSource || video,
			onTimeUpdate: this.onTimeUpdate,
			onSeeked: this.onSeeked,
			onPlaying: this.onPlaying,
			onPause: this.onPause,
			onEnded: this.onEnded
		};

		return (
			<div className={'flex-video widescreen ' + Provider.name}>
				{this.transferPropsTo(Provider(props))}
			</div>
		);
	}
});
