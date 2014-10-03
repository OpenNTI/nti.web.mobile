/**
 * @jsx React.DOM
 */
'use strict';
var React = require('react');
var kaltura = require('./kaltura');

var url = require('url');
var call = require('dataserverinterface/utils/function-call');

var MediaSource = require('dataserverinterface/models/MediaSource');

var Loading = require('../../Loading');
var eventHandlers = require('common/constants/VideoEventHandlers');

function _sources(options) {
	return kaltura.getSources(options);
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

		_sources({
			entryId: entryId,
			partnerId: partnerId,
			callback: function(data) {
				if (!this.isMounted()) {
					return;
				}
				this.setState({
					duration: data.duration,
					poster: data.poster,
					sources: data.sources || [],
					sourcesLoaded: true,
					isError: (data.objectType === 'KalturaAPIException')
				});
			}.bind(this)
		});

	},


	componentDidUpdate: function() {
		var video = this.getDOMNode();

		if ('video' === video.tagName.toLowerCase() && !this.state.listening) {
			Object.keys(eventHandlers).forEach(function(eventname) {
				video.addEventListener(eventname, this.props[eventHandlers[eventname]], false);
			}.bind(this));
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

		return this.transferPropsTo(
			React.DOM.video({
				controls: true,
				poster: this.state.poster,
				//Make sure these do not get passed to the DOM.
				src: null,
				source: null
			},
			//<source> children
				this.state.sources.map(function(val, i) {
					val.key = i + val['data-flavorid'];
					return React.DOM.source(val); })
		));
	}

});

module.exports = KalturaVideo;
