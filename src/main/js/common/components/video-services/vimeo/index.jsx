/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var ErrorWidget = require('../../Error');
var eventHandlers = require('../../../constants/VideoEventHandlers');

var guid = require('dataserverinterface/utils/guid');
var toQueryString = require('dataserverinterface/utils/object-to-querystring');

var vimeoEventsToHTML5 = {
	play: 'playing',
	pause: 'pause',
	finish: 'ended',
	seek: 'seeked',
	playProgress: 'timeupdate'
};

var Source = module.exports = React.createClass({
	displayName: 'Vimeo-Video',

	statics: {
		getId: function(url) {
			var regExp = /^.*vimeo(\:\/\/|\.com\/)(.+)/i,
				match = url.match(regExp);
			if (match && match[2]) {
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
		return {
			playerURL: this.buildURL()
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
		window.removeEventListener('message', this.onMessage, false);
	},



	componentWillReceiveProps: function() {
		this.updateURL();
	},


	buildURL: function () {
		var mediaSource = this.props.source;
		var videoId = typeof mediaSource === 'string' ? Source.getId(mediaSource) : mediaSource.source[0];

		var args = {
			api: 1,
			/* jshint -W106 */
			player_id: this.props.id,
			//autopause: 0, //we handle this for other videos, but its nice we only have to do this for cross-provider videos.
			autoplay: 0,
			badge: 0,
			byline: 0,
			loop: 0,
			portrait: 0,
			title: 0
		};

		return location.protocol + '//player.vimeo.com/video/' + videoId + '?' + toQueryString(args);
	},


	updateURL: function() {
		var url = this.buildURL();
		this.setState({
			scope: url.split('?')[0],
			playerURL: url
		});
	},



	getPlayerContext: function() {
		var iframe = this.getDOMNode();
		return iframe && (iframe.contentWindow || window.frames[iframe.name]);
	},


	onMessage: function(event) {
		var data = JSON.parse(event.data);
		var mappedEvent = vimeoEventsToHTML5[data.event];
		var handlerName = eventHandlers[mappedEvent];

		event = data.event;

		/* jshint -W106 */
		if (data.player_id !== this.props.id) {
			return;
		}

		data = data.data;
		console.debug('Vimeo Event: %s: %o', event, data);

		if (event === 'ready') {
			this.postMessage('addEventListener', 'play');	//playing
			this.postMessage('addEventListener', 'pause');	//pause
			this.postMessage('addEventListener', 'finish');	//ended
			this.postMessage('addEventListener', 'seek');	//seeked
			this.postMessage('addEventListener', 'playProgress'); //timeupdate
		} else if(mappedEvent && handlerName) {

			this.props[handlerName]({
				timeStamp: Date.now(),
				target: {currentTime: data && data.seconds},
				type: mappedEvent
			});

		}
	},


	postMessage: function(method, params) {
		var context = this.getPlayerContext(), data;
		if (!context) {
			console.warn(this.props.id, ' No Player Context!');
			return;
		}

		data = {
			method: method,
			value: params
		};

		context.postMessage(JSON.stringify(data), this.state.scope);
	},


	render: function() {
		if (!this.state.playerURL) {
			return (<ErrorWidget error="No source"/>);
		}

		return this.transferPropsTo(
			<iframe src={this.state.playerURL} frameBorder="0" seemless allowFullScreen allowTransparency />
		);
	},


	play: function () {
		this.postMessage('play');
	},


	pause: function () {
		this.postMessage('pause');
	},


	stop: function () {
		this.postMessage('stop');
	},


	setCurrentTime: function(time) {
		this.postMessage('seekTo', time);
	}
});
