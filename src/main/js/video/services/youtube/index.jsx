import React from 'react';
import invariant from 'react/lib/invariant';

import {EventHandlers} from '../../Constants';

import ErrorWidget from 'common/components/Error';
import MESSAGES from 'common/utils/WindowMessageListener';

import QueryString from 'query-string';

import guid from 'nti.lib.interfaces/utils/guid';
import Task from 'nti.lib.interfaces/utils/task';

const YOU_TUBE = 'https://www.youtube.com';

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
	2: 'pause',
	3: 'playing'
	//There is no seek event for YT
};


let Source = React.createClass({
	displayName: 'YouTube-Video',

	statics: {
		getId (url) {
			let regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&\?]*).*/,
				match = url.match(regExp);
			if (match && match[2].length === 11) {
				return match[2];
			}
			return null;
		}
	},


	propTypes: {
		source: React.PropTypes.any.isRequired
	},


	getInitialState () {
		return {id: guid(), scope: YOU_TUBE};
	},


	componentWillMount () {
		this.updateURL(this.props);
		this.setState({
			initTask: new Task(this.sendListening, 500)
		});
	},


	componentDidMount () {
		this.updateURL(this.props);
		MESSAGES.add(this.onMessage);
	},


	componentWillUnmount () {
		this.state.initTask.stop();
		MESSAGES.remove(this.onMessage);
	},


	componentWillReceiveProps (props) {
		this.updateURL(props);
	},


	componentDidUpdate (prevProps, prevState) {
		let state = this.state;
		let initTask = state.initTask;
		let prevInitTask = prevState.initTask;

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


	buildURL (props) {
		let mediaSource = props.source;
		let videoId = typeof mediaSource === 'string' ? Source.getId(mediaSource) : mediaSource.source[0];

		let args = {
			enablejsapi: 1,
			html5: 1,
			modestbranding: 1,
			autohide: 1,
			wmode: 'transparent',
			rel: 0,
			showinfo: 0,
			autoplay: props.autoPlay ? 1 : 0,
			origin: location.protocol + '//' + location.host
		};

		return `${YOU_TUBE}/embed/${videoId}?${QueryString.stringify(args)}`;
	},


	updateURL (props) {
		this.setState({playerURL: this.buildURL(props)});
	},


	getPlayerContext () {
		let iframe = this.getDOMNode();
		return iframe && (iframe.contentWindow || window.frames[iframe.name]);
	},


	render () {
		let {id} = this.state;
		let {source} = this.props;

		if (!source) {
			return (<ErrorWidget error="No source"/>);
		}

		let props = Object.assign({}, props, {
			name: id,
			deferred: null
		});

		return (<iframe {...props} src={this.state.playerURL}
			frameBorder="0" allowFullScreen allowTransparency />);
	},


	sendListening () {
		if (this.getPlayerContext()) {
			this.postMessage();
		}
	},


	finishInitialization () {
		this.setState({initialized: true});
		this.postMessage('addEventListener', ['onReady']);
		this.postMessage('addEventListener', ['onStateChange']);
		this.postMessage('addEventListener', ['onError']);
	},


	onMessage (event) {
		let data = JSON.parse(event.data);
		let eventName = (data && data.event) || '';
		let handlerName = 'handle' + eventName.charAt(0).toUpperCase() + eventName.substr(1);
		let implemented = !!this[handlerName];

		//event.source === this.getPlayerContext()

		let originMismatch = event.origin !== this.state.scope;
		let idMismatch = data.id !== this.state.id;

		if (originMismatch || idMismatch) {

			// console.debug('[YouTube] Ignoring Event (because origin mismatch: %o %o %o, or id mismatch %o, %o) %o',
			// 	originMismatch, event.origin, this.state.scope,
			// 	idMismatch, data.id || data,
			// 	event);
			return;
		}

		if (!this.state.initialized) {
			this.finishInitialization();
		}

		console[implemented ? 'debug' : 'warn']('[YouTube] Event: %s %s %o', data.id, data.event, data);
		if (implemented) {
			this[handlerName](data.info);
		}
	},


	postMessage (method, params) {
		let context = this.getPlayerContext(), data;
		if (!context) {
			console.warn(this.state.id, ' No Player Context!');
			return;
		}

		data = arguments.length ?
			{
				event: 'command',
				func: method,
				args: params,
				id: this.state.id
			} : {
				event: 'listening',
				id: this.state.id
			};
		console.debug('[YouTube] Sending: %o', data);
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
			if (state === 3) { this.play(); }
		}
		let event = YT_STATE_TO_EVENTS[state];
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
