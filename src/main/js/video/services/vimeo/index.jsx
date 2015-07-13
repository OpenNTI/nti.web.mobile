import React from 'react';
import ErrorWidget from 'common/components/Error';

import MESSAGES from 'common/utils/WindowMessageListener';

import {EventHandlers} from '../../Constants';

import guid from 'nti.lib.interfaces/utils/guid';
import QueryString from 'query-string';

const VIMEO_EVENTS_TO_HTML5 = {
	play: 'playing',
	pause: 'pause',
	finish: 'ended',
	seek: 'seeked',
	playProgress: 'timeupdate'
};

let Source = React.createClass({
	displayName: 'Vimeo-Video',


	statics: {
		getId (url) {
			let regExp = /^.*vimeo(\:\/\/|\.com\/)(.+)/i,
				match = url.match(regExp);
			if (match && match[2]) {
				return match[2];
			}
			return null;
		}
	},


	propTypes: {
		source: React.PropTypes.any.isRequired
	},


	getInitialState () {
		return {};
	},


	componentWillMount () {
		this.setState({id: guid()});
	},


	componentDidMount () {
		this.updateURL(this.props);
		MESSAGES.add(this.onMessage);
	},


	componentWillReceiveProps (nextProps) {
		this.updateURL(nextProps);
	},


	componentWillUnmount () {
		MESSAGES.remove(this.onMessage);
	},


	buildURL (props) {
		let mediaSource = props.source;
		let videoId = typeof mediaSource === 'string' ? Source.getId(mediaSource) : mediaSource.source;

		if (Array.isArray(videoId)) {
			videoId = videoId[0];
		}

		let args = {
			api: 1,
			player_id: this.state.id,//eslint-disable-line camelcase
			//autopause: 0, //we handle this for other videos, but its nice we only have to do this for cross-provider videos.
			autoplay: 0,
			badge: 0,
			byline: 0,
			loop: 0,
			portrait: 0,
			title: 0
		};

		return 'https://player.vimeo.com/video/' + videoId + '?' + QueryString.stringify(args);
	},


	updateURL (props) {
		let url = this.buildURL(props);
		this.setState({
			scope: url.split('?')[0],
			playerURL: url
		});
	},


	getPlayerContext () {
		let iframe = React.findDOMNode(this);
		return iframe && (iframe.contentWindow || window.frames[iframe.name]);
	},


	onMessage (event) {
		let data = JSON.parse(event.data);
		let mappedEvent = VIMEO_EVENTS_TO_HTML5[data.event];
		let handlerName = EventHandlers[mappedEvent];

		event = data.event;

		if (data.player_id !== this.state.id) {
			return;
		}

		data = data.data;
		console.debug('Vimeo Event: %s: %o', event, data);

		if (event === 'error') {
			if (data.code === 'play') {
				//Make the view just hide the poster so the viewer can tap the embeded player's play button.
				mappedEvent = 'playing';
				handlerName = EventHandlers.playing;
			} else {
				alert(`Vimeo Error: ${data.code}: ${data.message}`);//eslint-disable-line no-alert
			}
		}
		else if (event === 'ready') {
			this.postMessage('addEventListener', 'play');	//playing
			this.postMessage('addEventListener', 'pause');	//pause
			this.postMessage('addEventListener', 'finish');	//ended
			this.postMessage('addEventListener', 'seek');	//seeked
			this.postMessage('addEventListener', 'playProgress'); //timeupdate
		}

		if(mappedEvent && handlerName) {

			this.props[handlerName]({
				timeStamp: Date.now(),
				target: {
					currentTime: data && data.seconds,
					duration: data && data.duration
				},
				type: mappedEvent
			});

		}
	},


	postMessage (method, params) {
		let context = this.getPlayerContext(), data;
		if (!context) {
			console.warn(this.state.id, ' No Player Context!');
			return;
		}

		data = {
			method: method,
			value: params
		};

		context.postMessage(JSON.stringify(data), this.state.scope);
	},


	render () {
		if (!this.state.playerURL) {
			return (<ErrorWidget error="No source"/>);
		}

		let {id} = this.state;

		let props = Object.assign({}, this.props, {
			deferred: null,
			name: id
		});

		return (
			<iframe {...props} src={this.state.playerURL}
				frameBorder="0" seemless allowFullScreen allowTransparency />
		);
	},


	play () {
		this.postMessage('play');
	},


	pause () {
		this.postMessage('pause');
	},


	stop () {
		this.postMessage('stop');
	},


	setCurrentTime (time) {
		this.postMessage('seekTo', time);
	}
});

export default Source;
