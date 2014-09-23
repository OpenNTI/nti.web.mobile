/** @jsx React.DOM */
'use strict';

var vtt = require("vtt.js"),//https://github.com/mozilla/vtt.js
	WebVTT = vtt.WebVTT,
	VTTCue = vtt.VTTCue,
	VTTRegion = vtt.VTTRegion;

var React = require('react/addons');

var Loading = require('common/components/Loading');
var Error = require('common/components/Error');
var Video = require('common/components/Video');

/*
	See: https://github.com/mozilla/vtt.js#usage

*/

module.exports = React.createClass({
	displayName: 'TranscriptedVideo',


	/*
		<Video>
		<Transcript onSelect=SetVideoPositionAndPlay>
	 */


	render: function() {

		return (
			<div>
				<Video data={this.props.video}/>
			</div>
		);
	}
});
