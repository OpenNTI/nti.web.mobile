import React from 'react';
import {getHandler} from '../services';

import Fallback from '../services/html5';

import emptyFunction from 'react/lib/emptyFunction';

import {getModel} from 'nti.lib.interfaces';

import {emitEventStarted, emitEventEnded} from 'analytics/Actions';
import {toAnalyticsPath} from 'analytics/utils';

const WatchVideoEvent = getModel('analytics.watchvideoevent');

function deprecated (o, k) { if (o[k]) { return new Error(`Deprecated prop: \`${k}\`, use \`newWatchEventFactory\` callback prop.`); } }

export default React.createClass({
	displayName: 'Video',


	propTypes: {
		context: deprecated,
		courseId: deprecated,
		transcript: deprecated,


		/**
		 * The Video source. Either a URL or a Video model.
		 * @type {String/Video}
		 */
		src: React.PropTypes.oneOfType([
			React.PropTypes.string,
			React.PropTypes.instanceOf(getModel('video'))
		]).isRequired,


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


		deferred: React.PropTypes.bool,

		/**
		 * A factory method to construct a contextually relevant WatchVideoEvent.
		 * The one and only argument will be the video element to read off the
		 * currentTime and duration of the video.
		 *
		 * The factory should return a new WatchVideoEvent instance.
		 */
		newWatchEventFactory: React.PropTypes.func.isRequired
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
			if (analyticsEvent) {
				emitEventStarted(analyticsEvent);
				this.setState({
					playStartEvent: analyticsEvent
				});
			}
			return analyticsEvent;
		}
	},


	newWatchVideoEvent (browserEvent) {
		let {newWatchEventFactory, src} = this.props;

		if (!src.ntiid) {
			console.warn('No ntiid. Skipping WatchVideoEvent instantiation.');
			return null;
		}

		let target = (browserEvent || {}).target || {currentTime: 0, duration: 0};

		if (newWatchEventFactory) {
			return newWatchEventFactory(target);
		}

		//FIXME: The rest of the this code should move to the host component
		//the Context, courseId, transcript etc are all not universally relevant

		if (process.env.NODE_ENV !== 'production') {
			console.error('TODO: Move the rest of this method to be passed as an event factory');
		}

		//XXX: Do not fix this line of lint by adding these props to this elements PropTypes, nor making eslint ignore.
		//To fix it, do the above mentioned "FIXME".
		/*eslint "react/prop-types": 1*/ //Force this to be a warning for now.
		let {context, courseId, transcript} = this.props;

		let analyticsEvent = new WatchVideoEvent(
			src.ntiid,
			courseId, // courseId won't be relevant on Books
			toAnalyticsPath(context || []),
			target.currentTime, // video_start_time
			target.duration, // MaxDuration, the length of the entire video
			!!transcript // transcript is not used by this component, so its superfluous.
		);

		return analyticsEvent;
	},


	recordPlaybackStopped (event) {
		let {playStartEvent} = this.state;
		if (!playStartEvent) {
			console.warn('We don\'t have a playStartEvent. Dropping playbackStopped event on the floor.');
			return;
		}

		playStartEvent.finish(event.target.currentTime);
		emitEventEnded(playStartEvent);

		if (this.isMounted()) {
			this.setState({playStartEvent: null});
		}
	},


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
		let Provider = getHandler(video) || Fallback;
		let videoSource = video && (video.sources || {})[0];

		return (
			<div className={'flex-video widescreen ' + Provider.displayName}>
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
