import React from 'react';
import ErrorWidget from 'common/components/Error';

import MESSAGES from 'common/utils/WindowMessageListener';

import {EventHandlers} from '../../Constants';

import uuid from 'node-uuid';
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
			/*
			https://vimeo.com/11111111
			http://vimeo.com/11111111
			https://www.vimeo.com/11111111
			http://www.vimeo.com/11111111
			https://vimeo.com/channels/11111111
			http://vimeo.com/channels/11111111
			https://vimeo.com/channels/mychannel/11111111
			http://vimeo.com/channels/yourchannel/11111111
			https://vimeo.com/groups/name/videos/11111111
			http://vimeo.com/groups/name/videos/11111111
			https://vimeo.com/album/2222222/video/11111111
			http://vimeo.com/album/2222222/video/11111111
			https://vimeo.com/11111111?param=test
			http://vimeo.com/11111111?param=test
			https://player.vimeo.com/video/11111111
			 */
			const regExp = /https?:\/\/(?:(?:www|player)\.)?vimeo.com\/(?:(?:channels|video)\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?|#)/i;
			const [/*albumId*/, id] = url.match(regExp) || [];
			return id || null;
		}
	},


	propTypes: {
		source: React.PropTypes.any.isRequired
	},


	getInitialState () {
		return {};
	},


	componentWillMount () {
		let id = uuid.v4();
		this.setState({id});
		this.updateURL(this.props, id);
	},


	componentDidMount () {
		MESSAGES.add(this.onMessage);
	},


	componentWillReceiveProps (nextProps) {
		this.updateURL(nextProps);
	},


	componentWillUnmount () {
		MESSAGES.remove(this.onMessage);
	},


	buildURL (props, id = this.state.id) {
		const {source: mediaSource, autoPlay} = props;

		let videoId = typeof mediaSource === 'string' ? Source.getId(mediaSource) : mediaSource.source;

		if (Array.isArray(videoId)) {
			videoId = videoId[0];
		}

		if (!id) {
			console.error('Player ID missing');
		}

		let args = {
			api: 1,
			player_id: id,//eslint-disable-line camelcase
			//autopause: 0, //we handle this for other videos, but its nice we only have to do this for cross-provider videos.
			autoplay: autoPlay ? 1 : 0,
			badge: 0,
			byline: 0,
			loop: 0,
			portrait: 0,
			title: 0
		};

		return 'https://player.vimeo.com/video/' + videoId + '?' + QueryString.stringify(args);
	},


	updateURL (props, id) {
		let url = this.buildURL(props, id);
		this.setState({
			scope: url.split('?')[0],
			playerURL: url
		});
	},


	getPlayerContext () {
		const {refs: {iframe}} = this;
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

		console.debug('Vimeo Event: %s: %o', event, data.data || data);

		data = data.data;

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
			// this.flushQueue();
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
			<iframe ref="iframe" {...props} src={this.state.playerURL}
				frameBorder="0" seemless allowFullScreen allowTransparency />
		);
	},


	play () {
		//ready?
		this.postMessage('play');
		//else queue.
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
