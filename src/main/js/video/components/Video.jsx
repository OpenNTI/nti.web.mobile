import React from 'react/addons';
import {getHandler} from '../services';

import emptyFunction from 'react/lib/emptyFunction';

import {getModel} from 'dataserverinterface';

import {emitVideoEvent} from '../Actions';

const WatchVideoEvent = getModel('analytics.watchvideoevent');

export default React.createClass({
	displayName: 'Video',


	propTypes: {
		/**
		 * The Video source. Either a URL or a Video model.
		 * @type {String/Video}
		 */
		src: React.PropTypes.oneOfType([
			React.PropTypes.string,
			React.PropTypes.instanceOf(getModel('video'))
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


	getInitialState () {
		return {
			// keep track of the play start event so we can push analytics including duration
			// when the video is paused, stopped, seeked, or ends.
			playStartEvent: null
		};
	},


	getDefaultProps () {
		return {
			context:[],
			onTimeUpdate: emptyFunction,
			onSeeked: emptyFunction,
			onPlaying: emptyFunction,
			onPause: emptyFunction,
			onEnded: emptyFunction
		};
	},


	getAnalyticsEventData (event) {
		return {
			timestamp: event.timeStamp,
			target: event.target,
			currentTime: event.target.currentTime,
			duration: event.target.duration,
			type: event.type
		};
	},


	recordPlaybackStarted (event) {
		if (this.state.playStartEvent) {
			console.warn('We already have a playStartEvent. How did we get another one without a ' +
						'pause/stop/seek/end in between? Dropping previous start event on the floor.');
		}
		this.setState({playStartEvent: this.getAnalyticsEventData(event)});
	},


	recordPlaybackStopped (event) {
		if (!this.state.playStartEvent) {
			console.warn('We don\'t have a playStartEvent? How did we get a stop event without a prior start event? Dropping the event on the floor.');
			return;
		}

		var playEndEvent = this.getAnalyticsEventData(event);

		this.emitAnalyticsEvent(this.state.playStartEvent, playEndEvent);

		this.setState({playStartEvent: null});
	},


	emitAnalyticsEvent (startEvent, endEvent) {
		var fallback = {duration:0, currentTime:0};

		endEvent = endEvent || fallback;
		startEvent = startEvent || fallback;

		var ctx = (this.props.context || []).map(x => x.ntiid||x);

		var rootContextId = ctx[0] || null;

		var even = new WatchVideoEvent(
				this.props.src.ntiid,
				rootContextId,
				ctx,
				(endEvent.currentTime - startEvent.currentTime),
				startEvent.currentTime,
				endEvent.currentTime,
				startEvent.duration,
			 	!!this.props.transcript
			);

		emitVideoEvent(even);
	},


	onTimeUpdate (event) {
		// this.emitAnalyticsEvent(event);
		this.props.onTimeUpdate(event);
	},


	onSeeked (event) {
		// this.emitAnalyticsEvent(event);
		this.props.onSeeked(event);
	},


	onPlaying (event) {
		this.emitAnalyticsEvent();//as soon as it starts, record an empty event. (matches webapp behavior)
		this.recordPlaybackStarted(event);
		this.props.onPlaying(event);
	},


	onPause (event) {
		this.recordPlaybackStopped(event);
		this.props.onPause(event);
	},


	onEnded (event) {
		this.recordPlaybackStopped(event);
		this.props.onEnded(event);
	},


	play  () {
		this.refs.activeVideo.play();
	},


	pause  () {
		this.refs.activeVideo.pause();
	},


	stop  () {
		this.refs.activeVideo.stop();
	},


	setCurrentTime (time) {
		this.refs.activeVideo.setCurrentTime(time);
	},


	render () {
		var video = this.props.src;
		var Provider = getHandler(video) || 'div';
		var videoSource = video && (video.sources || {})[0];

		return (
			<div className={'flex-video widescreen ' + Provider.name}>
				<Provider {...this.props}
					ref="activeVideo"
					source={videoSource || video}
					onTimeUpdate={this.onTimeUpdate}
					onSeeked={this.onSeeked}
					onPlaying={this.onPlaying}
					onPause={this.onPause}
					onEnded={this.onEnded}
					/>
			</div>
		);
	}
});
