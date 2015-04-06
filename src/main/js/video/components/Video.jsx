import React from 'react';
import {getHandler} from '../services';

import emptyFunction from 'react/lib/emptyFunction';

import {getModel} from 'nti.lib.interfaces';

import {emitEventStarted, emitEventEnded} from 'analytics/Actions';

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
		 * Callback for time updates as video plays.
		 *
		 * @type {onTimeUpdate}
		 */
		onTimeUpdate: React.PropTypes.func,
		onSeeked: React.PropTypes.func,
		onPlaying: React.PropTypes.func,
		onPause: React.PropTypes.func,
		onEnded: React.PropTypes.func,


		deferred: React.PropTypes.bool
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
			context: [],
			onTimeUpdate: emptyFunction,
			onSeeked: emptyFunction,
			onPlaying: emptyFunction,
			onPause: emptyFunction,
			onEnded: emptyFunction
		};
	},


	getAnalyticsEventData (event) {
		return {
			// timestamp: event.timeStamp,
			target: event.target,
			currentTime: event.target.currentTime,
			duration: event.target.duration,
			type: event.type
		};
	},


	recordPlaybackStarted (event) {
		if (this.state.playStartEvent) {
			// this can be triggered by a tap on the transcript, which jumps the video to that location.
			console.warn('We already have a playStartEvent. How did we get another one without a ' +
						'pause/stop/seek/end in between?');
			let e = this.state.playStartEvent;
			e.finish();
			emitEventEnded(e);
		}

		if (this.isMounted()) {
			let analyticsEvent = this.newWatchVideoEvent(event);
			emitEventStarted(analyticsEvent);
			this.setState({
				playStartEvent: analyticsEvent // this.getAnalyticsEventData(event)
			});
			return analyticsEvent;
		}
	},


	newWatchVideoEvent(browserEvent) {
		let ctx = (this.props.context || [])
			.map(x=> x.ntiid || (typeof x === 'string' ? x : null))
			.filter(x=>x); // removes nulls

		let target = (browserEvent || {}).target || {currentTime: 0, duration: 0};

		let analyticsEvent = new WatchVideoEvent(
			this.props.src.ntiid,
			ctx,
			target.currentTime, // video_start_time
			target.duration, // MaxDuration, the length of the entire video
			!!this.props.transcript
		);

		return analyticsEvent;
	},


	recordPlaybackStopped (event) {
		let {playStartEvent} = this.state;
		if (!playStartEvent) {
			console.warn('We don\'t have a playStartEvent? How did we get a stop event without a prior start event? Dropping the event on the floor.');
			return;
		}

		playStartEvent.finish(event.target.currentTime);
		emitEventEnded(playStartEvent);

		if (this.isMounted()) {
			this.setState({playStartEvent: null});
		}
	},


	// emitEmptyAnalyticsEvent () {
	// 	let event = this.newWatchVideoEvent();
	// 	emitEventStarted(event);
	// 	event.finish(0);
	// 	emitEventEnded(event);
	// },


	onTimeUpdate (event) {
		this.props.onTimeUpdate(event);
	},


	onSeeked (event) {
		this.props.onSeeked(event);
	},


	onPlaying (event) {
		// as soon as it starts, record an empty event. (matches webapp behavior)
		// we do this so if the user closes the window we still ahve a record of them having played the video.
		// this.emitEmptyAnalyticsEvent();

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
		let video = this.props.src;
		let Provider = getHandler(video) || 'div';
		let videoSource = video && (video.sources || {})[0];

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
