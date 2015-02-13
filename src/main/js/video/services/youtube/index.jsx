import React from 'react/addons';
import invariant from 'react/lib/invariant';

import {EventHandlers} from '../../Constants';

import ErrorWidget from 'common/components/Error';

import QueryString from 'query-string';

import guid from 'dataserverinterface/utils/guid';
import Task from 'dataserverinterface/utils/task';

var YOU_TUBE = 'https://www.youtube.com';

/*
const YOU_TUBE_STATES = {
	'-1': 'UNSTARTED',
	0: 'ENDED',
	1: 'PLAYING',
	2: 'PAUSED',
	3: 'BUFFERING',
	5: 'CUED'
};
*/
const YT_STATE_TO_EVENTS = {
	0: 'ended',
	1: 'playing',
	2: 'pause'
	//There is no seek event for YT
};

var Source = React.createClass({
	displayName: 'YouTube-Video',

	statics: {
		getId (url) {
			var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&\?]*).*/,
				match = url.match(regExp);
			if (match && match[2].length === 11) {
				return match[2];
			}
			return null;
		}
	},


	propTypes: {
		id: React.PropTypes.string,
		source: React.PropTypes.any.isRequired
	},


	getInitialState () {
		return {scope: YOU_TUBE};
	},


	getDefaultProps () {
		return {
			id: guid()
		};
	},


	componentWillMount () {
		this.updateURL();
		this.setState({
			initTask: new Task(this.sendListening, 500)
		});
	},


	componentDidMount () {
		this.updateURL();
		window.addEventListener('message', this.onMessage, false);
	},


	componentWillUnmount () {
		this.state.initTask.stop();
		window.removeEventListener('message', this.onMessage, false);
	},


	componentWillReceiveProps () {
		this.updateURL();
	},


	componentDidUpdate (prevProps, prevState) {
		var state = this.state;
		var initTask = state.initTask;
		var prevInitTask = prevState.initTask;

		invariant(
			(initTask && (initTask === prevInitTask || !prevInitTask)),
			'Something changed the initTask!'
		);

		if (state.initialized && state.playerURL === prevState.playerURL) {
			initTask.stop();
			return;
		}

		initTask.start();
	},


	buildURL () {
		var mediaSource = this.props.source;
		var videoId = typeof mediaSource === 'string' ? Source.getId(mediaSource) : mediaSource.source[0];

		var args = {
			enablejsapi: 1,
			html5: 1,
			modestbranding: 1,
			autohide: 1,
			wmode: 'transparent',
			rel: 0,
			showinfo: 0,
			autoplay: this.props.autoPlay? 1:0,
			origin: location.protocol + '//' + location.host
		};

		return YOU_TUBE + '/embed/' + videoId + '?' + QueryString.stringify(args);
	},


	updateURL () {
		this.setState({playerURL: this.buildURL()});
	},


	getPlayerContext () {
		var iframe = this.getDOMNode();
		return iframe && (iframe.contentWindow || window.frames[iframe.name]);
	},


	render () {
		if (!this.props.src) {
			return (<ErrorWidget error="No source"/>);
		}

		return (<iframe {...this.props} src={this.state.playerURL}
			frameBorder="0" allowFullScreen allowTransparency />);
	},


	sendListening () {
		this.postMessage();
	},


	finishInitialization () {
		this.setState({initialized: true});
		this.postMessage('addEventListener', ['onReady']);
		this.postMessage('addEventListener', ['onStateChange']);
		this.postMessage('addEventListener', ['onError']);
	},


	onMessage (event) {
		var data = JSON.parse(event.data);
		var eventName = (data && data.event) || '';
		var handlerName = 'handle' + eventName.charAt(0).toUpperCase() + eventName.substr(1);
		var implemented = !!this[handlerName];

		//event.source === this.getPlayerContext()
		if (event.origin !== this.state.scope || data.id !== this.props.id) {
			console.debug('[YouTube] Ignoring Event: %o', event);
			return;
		}

		if (!this.state.initialized) {
			this.finishInitialization();
		}

		console[implemented?'debug':'warn']('[YouTube] Event: %s', data.event);
		if (implemented) {
			this[handlerName](data.info);
		}
	},


	postMessage (method, params) {
		var context = this.getPlayerContext(), data;
		if (!context) {
			console.warn(this.props.id, ' No Player Context!');
			return;
		}

		data = arguments.length ?
			{
				event: 'command',
				func: method,
				args: params,
				id: this.props.id
			} : {
				event: 'listening',
				id: this.props.id
			};
		//console.debug('[YouTube] Sending: %o', data);
		context.postMessage(JSON.stringify(data), this.state.scope);
	},


	handleInfoDelivery (info) {
		this.setState(info);
		if (info.hasOwnProperty('currentTime')) {
			this.fireEvent('timeupdate');
		}
	},


	handleInitialDelivery (info) {
		this.setState(info);
	},


	handleApiInfoDelivery () {},
	handleOnReady () {},//nothing to do


	handleOnStateChange (state) {
		if (this.state.playerState !== state) {
			this.setState({playerState: state});
		}
		var event = YT_STATE_TO_EVENTS[state];
		if (event) {
			this.fireEvent(event);
		}
	},


	fireEvent (event) {
		if (this.props[EventHandlers[event]]) {

			this.props[EventHandlers[event]]({
				timeStamp: Date.now(),
				target: {
					currentTime: this.state.currentTime,
					duration: this.state.duration
				},
				type: event
			});
		}
	},


	play () {
		this.postMessage('playVideo');
	},


	pause () {
		this.postMessage('pauseVideo');
	},


	stop () {
		this.postMessage('stopVideo');
	},


	setCurrentTime (time) {
		this.postMessage('seekTo', time);
	}
});

export default Source;
