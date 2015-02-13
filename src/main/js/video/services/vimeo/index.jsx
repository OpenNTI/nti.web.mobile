import React from 'react/addons';
import ErrorWidget from 'common/components/Error';

import {EventHandlers} from '../../Constants';

import guid from 'dataserverinterface/utils/guid';
import QueryString from 'query-string';

const VIMEO_EVENTS_TO_HTML5 = {
	play: 'playing',
	pause: 'pause',
	finish: 'ended',
	seek: 'seeked',
	playProgress: 'timeupdate'
};

var Source = React.createClass({
	displayName: 'Vimeo-Video',


	statics: {
		getId (url) {
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


	getInitialState () {
		return { playerURL: null };
	},


	getDefaultProps () {
		return {
			id: guid()
		};
	},


	componentWillMount () {
		this.setState({playerURL: this.buildURL()});
	},


	componentDidMount () {
		this.updateURL();
		window.addEventListener('message', this.onMessage, false);
	},


	componentWillUnmount () {
		window.removeEventListener('message', this.onMessage, false);
	},


	componentWillReceiveProps () {
		this.updateURL();
	},


	buildURL () {
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

		return location.protocol + '//player.vimeo.com/video/' + videoId + '?' + QueryString.stringify(args);
	},


	updateURL () {
		var url = this.buildURL();
		this.setState({
			scope: url.split('?')[0],
			playerURL: url
		});
	},


	getPlayerContext () {
		var iframe = this.getDOMNode();
		return iframe && (iframe.contentWindow || window.frames[iframe.name]);
	},


	onMessage (event) {
		var data = JSON.parse(event.data);
		var mappedEvent = VIMEO_EVENTS_TO_HTML5[data.event];
		var handlerName = EventHandlers[mappedEvent];

		event = data.event;

		/* jshint -W106 */
		if (data.player_id !== this.props.id) {
			return;
		}

		data = data.data;
		console.debug('Vimeo Event: %s: %o', event, data);

		if (event === 'error') {
			alert(`Vimeo Error: ${data.code}: ${data.message}`);
		}
		else if (event === 'ready') {
			this.postMessage('addEventListener', 'play');	//playing
			this.postMessage('addEventListener', 'pause');	//pause
			this.postMessage('addEventListener', 'finish');	//ended
			this.postMessage('addEventListener', 'seek');	//seeked
			this.postMessage('addEventListener', 'playProgress'); //timeupdate
		}
		else if(mappedEvent && handlerName) {

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


	render () {
		if (!this.state.playerURL) {
			return (<ErrorWidget error="No source"/>);
		}

		return (
			<iframe {...this.props} src={this.state.playerURL}
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
