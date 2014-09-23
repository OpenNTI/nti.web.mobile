/** @jsx React.DOM */
'use strict';

var vtt = require("vtt.js"),//https://github.com/mozilla/vtt.js
	WebVTT = vtt.WebVTT,
	VTTCue = vtt.VTTCue,
	VTTRegion = vtt.VTTRegion;

var NO_TRANSCRIPT = 'No Transcript';

var React = require('react/addons');

var Loading = require('common/components/Loading');
var Error = require('common/components/Error');
var Video = require('common/components/Video');

/*
	See: https://github.com/mozilla/vtt.js#usage

*/

module.exports = React.createClass({
	displayName: 'TranscriptedVideo',


	getInitialState: function() {
		return {
			loading: true, error: false, transcript: null
		};
	},


	componentDidMount: function() {
		//Store.addChangeListener(this._onChange);
		this.getDataIfNeeded(this.props);
	},


	componentWillUnmount: function() {
		//Store.removeChangeListener(this._onChange);
	},


	componentWillReceiveProps: function(nextProps) {
		if (nextProps.video !== this.props.video) {
			this.getDataIfNeeded(nextProps);
		}
	},


	__onError: function(error) {
		this.setState({
			loading: false,
			error: error,
			data: null
		});
	},


	getDataIfNeeded: function(props) {
		this.setState(this.getInitialState());
		try {
			var props = this.props;
			var course = props.course;
			var video = props.video;
			var transcriptSrc = ((video && (video.transcripts || []))[0] || {}).src;

			transcriptSrc = transcriptSrc ?
				course.resolveContentURL(transcriptSrc) :
				Promise.reject(NO_TRANSCRIPT);

			transcriptSrc.then(function(url) {

				debugger;
			});

		} catch (e) {
			this.__onError(e);
		}
	},




	render: function() {
		var collection=this.props.parentPath;

		return (
			<div>
				<a href={collection} className="toolbar-button-left fi-thumbnails"/>
				<Video data={this.props.video} autoBuffer autoPlay />
			</div>
		);
	}
});
