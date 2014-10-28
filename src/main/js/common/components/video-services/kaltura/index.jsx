/**
 * @jsx React.DOM
 */
'use strict';
var React = require('react');
var getSources = require('./SourceGrabber');

var url = require('url');
var call = require('dataserverinterface/utils/function-call');

var MediaSource = require('dataserverinterface/models/MediaSource');

var getTarget = require('common/Utils').Dom.getEventTarget;

var Loading = require('../../Loading');
var eventHandlers = require('common/constants/VideoEventHandlers');

function _sources(options) {
	return getSources(options);
}

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

		getSources({
			entryId: entryId,
			partnerId: partnerId
		}).then(this.setSources);

	},


	setSources: function(data) {
		if (!this.isMounted()) {
			return;
		}
		var w = 1280;
		var poster = '//www.kaltura.com/p/'+this.state.partnerId+'/thumbnail/entry_id/'+data.entryId+'/width/'+w+'/';

		this.setState({
			duration: data.duration,
			poster: poster,
			sources: data.sources || [],
			sourcesLoaded: true,
			isError: (data.objectType === 'KalturaAPIException')
		});

		if (this.state.interacted) {
			this.doPlay();
		}
	},


	doPlay: function (e) {
		console.log('Clicked Play');
		var isAnchor = e && getTarget(e, 'a');
		var s = this.state.sources;
		var v = this.refs.video.getDOMNode();

		if (isAnchor) {
			e.preventDefault();
			e.stopPropagation();
		}

		if (v.childNodes.length > 0) {
			console.log('Already has children?');
			return;
		}

		s.map(function(source) {
			var s = document.createElement('source');
			s.setAttribute('src', source.src);
			s.setAttribute('type', source.type);
			s.setAttribute('flavor', source.flavorid);

			v.appendChild(s);
		});

		v.load();
		v.play();
		this.setState({interacted: true});
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

	setCurrentTime: function(time) {
		if (this.isMounted()) {
			this.getDOMNode().currentTime = time;
		}
	},

	render: function() {

		if(!this.state.sourcesLoaded) {
			return Loading();
		}

		if(this.state.isError) {
			return (<div className="error">Unable to load video.</div>);
		}

		console.log(this.props);

		var Tag = React.DOM.video;
		var videoProps = {
			ref: 'video',
			controls: true,
			poster: this.state.poster,
			src: null,
			source: null,
			onClick: this.doPlay
		};

		Object.keys(this.props).forEach(function(key) {
			if (/^on/i.test(key)) {
				videoProps[key] = null;
			}
		});

		var interacted = this.state.interacted ? 'loaded' : '';

		return (
			<div className={'video-wrapper ' + interacted}>
				{this.transferPropsTo(Tag(videoProps))}
				{!this.state.interacted && <a className="tap-area play" href="#" onClick={this.doPlay} style={{backgroundImage: 'url('+this.state.poster+')'}}/>}
			</div>
		);
	},

	onError: function () {
		this.setState({
			error: 'Could not play video. Network or Browser error.'
		});
	}

});

module.exports = KalturaVideo;
