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

function _sources(options) {
	return kaltura.getSources(options);
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
				this.setState({
					duration: data.duration,
					poster: data.poster,
					sources: data.sources || [],
					sourcesLoaded: true,
					isError: (data.objectType == 'KalturaAPIException')
				});
			}.bind(this)
		});

	},


	componentDidUpdate: function() {
		var video = this.getDOMNode();

		if ('video' === video.tagName.toLowerCase() && !this.state.listening) {
			video.addEventListener('timeupdate', this.onTimeUpdate, false);
			this.setState({listening: true});
		}
	},


	componentWillUnmount: function() {
		var video = this.getDOMNode();
		if (video) {
			video.removeEventListener('timeupdate', this.onTimeUpdate, false);
		}
	},


	onTimeUpdate: function(e) {
		call(this.props.onTimeUpdate, e.target.currentTime);
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
