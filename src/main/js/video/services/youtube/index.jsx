'use strict';

var React = require('react/addons');
var invariant = require('react/lib/invariant');

var eventHandlers = require('../../Constants').EventHandlers;

var ErrorWidget = require('common/components/Error');

var guid = require('dataserverinterface/utils/guid');
var toQueryString = require('dataserverinterface/utils/object-to-querystring');
var Task = require('dataserverinterface/utils/task');

var YOU_TUBE = 'https://www.youtube.com';

/*var YOU_TUBE_STATES = {
	'-1': 'UNSTARTED',
	0: 'ENDED',
	1: 'PLAYING',
	2: 'PAUSED',
	3: 'BUFFERING',
	5: 'CUED'
};
*/
var YT_STATE_TO_EVENTS = {
	0: 'ended',
	1: 'playing',
	2: 'pause'
	//There is no seek event for YT
};

var Source = module.exports = React.createClass({
	displayName: 'YouTube-Video',

	statics: {
		getId: function(url) {
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


	getInitialState: function() {
		//FIXME: Re-write this:
		// See: http://facebook.github.io/react/tips/props-in-getInitialState-as-anti-pattern.html
		// Additional Node: On Mount and Recieve Props fill state (this is ment to be called one per CLASS lifetime not Instance lifetime)

		return {
			scope: YOU_TUBE,
			playerURL: this.buildURL(),
			initTask: new Task(this.sendListening, 500)
		};
	},


	getDefaultProps: function() {
		return {
			id: guid()
		};
	},


	componentDidMount: function() {
		this.updateURL();
		window.addEventListener('message', this.onMessage, false);
	},


	componentWillUnmount: function() {
		this.state.initTask.stop();
		window.removeEventListener('message', this.onMessage, false);
	},


	componentWillReceiveProps: function() {
		this.updateURL();
	},


	componentDidUpdate: function(prevProps, prevState) {
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


	buildURL: function () {
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

		return YOU_TUBE + '/embed/' + videoId + '?' + toQueryString(args);
	},


	updateURL: function() {
		var url = this.buildURL();
		this.setState({
			playerURL: url
		});
	},


	getPlayerContext: function() {
		var iframe = this.getDOMNode();
		return iframe && (iframe.contentWindow || window.frames[iframe.name]);
	},


	render: function() {
		if (!this.props.src) {
			return (<ErrorWidget error="No source"/>);
		}

		return (<iframe {...this.props} src={this.state.playerURL}
			frameBorder="0" allowFullScreen allowTransparency />);
	},


	sendListening: function () {
		this.postMessage();
	},


	finishInitialization: function () {
		this.setState({initialized: true});
		this.postMessage('addEventListener', ['onReady']);
		this.postMessage('addEventListener', ['onStateChange']);
		this.postMessage('addEventListener', ['onError']);
	},


	onMessage: function(event) {
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


	postMessage: function(method, params) {
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


	handleInfoDelivery: function (info) {
		this.setState(info);
		if (info.hasOwnProperty('currentTime')) {
			this.fireEvent('timeupdate');
		}
	},


	handleInitialDelivery: function (info) {
		this.setState(info);
	},


	handleApiInfoDelivery: function () {},
	handleOnReady: function () {},//nothing to do


	handleOnStateChange: function (state) {
		if (this.state.playerState !== state) {
			this.setState({playerState: state});
		}
		var event = YT_STATE_TO_EVENTS[state];
		if (event) {
			this.fireEvent(event);
		}
	},


	fireEvent: function (event) {
		if (this.props[eventHandlers[event]]) {

			this.props[eventHandlers[event]]({
				timeStamp: Date.now(),
				target: {
					currentTime: this.state.currentTime,
					duration: this.state.duration
				},
				type: event
			});
		}
	},


	play: function () {
		this.postMessage('playVideo');
	},


	pause: function () {
		this.postMessage('pauseVideo');
	},


	stop: function () {
		this.postMessage('stopVideo');
	},


	setCurrentTime: function(time) {
		this.postMessage('seekTo', time);
	}
});
