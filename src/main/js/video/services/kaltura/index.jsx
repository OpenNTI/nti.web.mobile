'use strict';

var React = require('react/addons');
var getSources = require('./SourceGrabber');
var selectSources = require('./SelectSources');

var url = require('url');

var MediaSource = require('dataserverinterface/models/MediaSource');

var Utils = require('common/Utils');
var getTarget = Utils.Dom.getEventTarget;
//var Viewport = Utils.Viewport;

var Loading = require('common/components/Loading');
var eventHandlers = require('../../Constants').EventHandlers;

function _videoEventHandler(event) {
	console.warn('No handler specified for video event \'%s\'', event.type);
}

/**
 * @class KalturaVideo
 *
 * The Kaltura Video source implementation
 */
var KalturaVideo = React.createClass({
	displayName: 'KalturaVideo',

	propTypes: {
		/**
		 * Either a URL string or a source descriptor object.
		 *
		 * @type {String/MediaSource}
		 */
		source: React.PropTypes.oneOfType([
			React.PropTypes.string,
			React.PropTypes.instanceOf(MediaSource)
			]).isRequired
	},

	getDefaultProps: function() {
		var p = {};
		// default no-op video event handlers
		Object.keys(eventHandlers).forEach(function(eventname) {
			p[eventHandlers[eventname]] = _videoEventHandler;
		});
		return p;
	},


	getInitialState: function() {
		return {
			sources: [],
			sourcesLoaded: false,
			isError: false,
			listening: false
		};
	},


	componentDidMount: function() {
		var data = this.props.source;
		// kaltura://1500101/0_4ol5o04l/
		var src = typeof data === 'string' && data;
		var parsed = src && url.parse(src);

		var partnerId;
		var entryId;

		if (src) {
			partnerId = parsed.host;
			entryId = /\/(.*)\/$/.exec(parsed.path)[1];
		} else if (data) {
			parsed = ((data.source || [])[0] || '').split(':');
			partnerId = parsed[0];
			entryId = parsed[1];
		}

		this.setState({
			partnerId: partnerId
		});

		getSources({ entryId: entryId, partnerId: partnerId })
			.then(this.setSources);

	},


	setSources: function(data) {
		if (!this.isMounted()) {
			return;
		}

		var qualityPreference = this.state.quality;//TODO: allow selection...
		var sources = selectSources(data.sources || [], qualityPreference);
		var availableQualities = sources.qualities;

		this.setState({
			duration: data.duration,
			poster: data.poster,
			sources: sources,
			allSources: data.sources,
			qualities: availableQualities,
			sourcesLoaded: true,
			isError: (data.objectType === 'KalturaAPIException')
		});

		if (this.state.interacted) {
			this.doPlay();
		}
	},


	componentDidUpdate: function() {
		var video = this.refs.video;
		var props = this.props;

		if (video && !this.state.listening) {
			video = video.getDOMNode();
			video.addEventListener('error', this.onError, false);

			if (this.props.autoPlay) {
				this.doPlay();
			}

			//attempt to tell the WebView to play inline...
			video.setAttribute('webkit-playsinline', true);

			Object.keys(eventHandlers).forEach(function(eventname) {
				video.addEventListener(eventname, props[eventHandlers[eventname]], false);
			});

			this.setState({listening: true});
		}
	},


	componentWillUnmount: function() {
		var video = this.getDOMNode();
		if (video) {
			Object.keys(eventHandlers).forEach(function(eventname) {
				video.removeEventListener(eventname, this.props[eventHandlers[eventname]], false);
			}.bind(this));
		}
	},


	render: function() {

		if(!this.state.sourcesLoaded) {
			return Loading();
		}

		if(this.state.isError) {
			return (<div className="error">Unable to load video.</div>);
		}

		var videoProps = Object.assign({}, this.props, {
			ref: 'video',
			controls: !/iP(hone|od)/i.test(navigator.userAgent),
			poster: this.state.poster,
			src: null,
			source: null,
			onClick: this.doPlay
		});

		Object.keys(this.props).forEach(function(key) {
			if (/^on/i.test(key)) {
				videoProps[key] = null;
			}
		});

		var interacted = this.state.interacted ? 'loaded' : '';

		return (
			<div className={'video-wrapper ' + interacted}>
				<video {...videoProps}>
					{this._renderSources()}
				</video>
				{!this.state.interacted && <a className="tap-area play" href="#" onClick={this.doPlay}
						style={{backgroundImage: 'url('+this.state.poster+')'}}/>}
			</div>
		);
	},


	_renderSources: function() {
		var sources = this.state.sources || [];
		var Tag = React.DOM.source;
		return sources.map(function(source) {
			return Tag({key:source.src, src:source.src, type: source.type});
		});
	},


	onError: function () {
		this.setState({
			error: 'Could not play video. Network or Browser error.'
		});
	},


	doPlay: function (e) {
		var isAnchor = e && getTarget(e, 'a');

		if (isAnchor) {
			e.preventDefault();
			e.stopPropagation();
		}

		this.play();
	},


	play: function () {
		var v = this.refs.video;
		if (v && this.isMounted()) {
			this.setState({interacted: true});
			v = v.getDOMNode();
			if(v.play){v.play();}
		}
	},


	pause: function () {
		var v = this.refs.video;
		if (v && this.isMounted()) {
			v = v.getDOMNode();
			if(v.pause){v.pause();}
		}
	},


	stop: function () {
		var v = this.refs.video;
		if (v && this.isMounted()) {
			v = v.getDOMNode();
			if(v.stop){v.stop();}
		}
	},


	setCurrentTime: function(time) {
		var v = this.refs.video;
		if (v && this.isMounted()) {
			v.getDOMNode().currentTime = time;
		}
	}
});

module.exports = KalturaVideo;
