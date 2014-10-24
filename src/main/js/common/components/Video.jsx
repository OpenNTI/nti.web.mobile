/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var Providers = require('./video-services');
var Model = require('dataserverinterface/models/Video');
var call = require('dataserverinterface/utils/function-call');
var actions = require('./VideoActions');

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
		* An array of ntiids reflecting the current course/node/etc.
		*/
		context: React.PropTypes.array.isRequired,

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

	_emit: function(event) {
		actions.emitVideoEvent(event,this.props.context);
	},

	onTimeUpdate: function(event) {
		this._emit(event);
		call(this.props.onTimeUpdate,event);
	},

	onSeeked: function(event) {
		this._emit(event);
		call(this.props.onSeeked,event);
	},

	onPlaying: function(event) {
		this._emit(event);
		call(this.props.onPlaying,event);
	},

	onPause: function(event) {
		this._emit(event);
		call(this.props.onPause,event);
	},

	onEnded: function(event) {
		this._emit(event);
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
			// src: typeof video === 'string' && video,
			source: videoSource || video,
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
