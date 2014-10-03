/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var Providers = require('./video-services');
var Model = require('dataserverinterface/models/Video');
var call = require('dataserverinterface/utils/function-call');

module.exports = React.createClass({
	displayName: 'Video',

	propTypes: {
		/**
		 * The Video source. Either a URL or a Video model.
		 * @type {String/Video}
		 */
		src: React.PropTypes.oneOfType([
			React.PropTypes.string,
			React.PropTypes.instanceOf(Model)
			]).isRequired,

		/**
		 * @callback onTimeUpdate
		 * @param {float} time - the position in the video in seconds. (float)
		 */

		/**
		 * Callback for time updates as video plays back.
		 *
		 * @type {onTimeUpdate}
		 */
		onTimeUpdate: React.PropTypes.func,
		onSeeked: React.PropTypes.func,
		onPlaying: React.PropTypes.func,
		onPause: React.PropTypes.func,
		onEnded: React.PropTypes.func
	},

	onTimeUpdate: function(event) {
		console.log('onTimeUpdate');
		call(this.props.onTimeUpdate,event);
	},

	onSeeked: function(event) {
		console.log('onSeeked');
		call(this.props.onSeeked,event);
	},

	onPlaying: function(event) {
		console.log('onPlaying');
		call(this.props.onPlaying,event);
	},

	onPause: function(event) {
		console.log('onPause');
		call(this.props.onPause,event);
	},

	onEnded: function(event) {
		console.log('onEnded');
		call(this.props.onEnded,event);
	},

	setCurrentTime: function(time) {
		this.refs.activeVideo.setCurrentTime(time);
	},

	render: function() {
		var video = this.props.src;
		var Provider = Providers.getHandler(video);
		var videoSource = video && (video.sources || {})[0];

		var props = {
			ref: 'activeVideo',
			src: typeof video === 'string' && video,
			source: videoSource,
			onTimeUpdate: this.onTimeUpdate,
			onSeeked: this.onSeeked,
			onPlaying: this.onPlaying,
			onPause: this.onPause,
			onEnded: this.onEnded
		};

		return (
			<div className={'flex-video widescreen ' + Provider.name}>
				{this.transferPropsTo(Provider(props))}
			</div>
		);
	}
});
