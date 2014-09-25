/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var Providers = require('./video-services');
var Model = require('dataserverinterface/models/Video');

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
		onTimeUpdate: React.PropTypes.func
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
			source: videoSource
		};

		return (
			<div className={'flex-video widescreen ' + Provider.name}>
				{this.transferPropsTo(Provider(props))}
			</div>
		);
	}
});
