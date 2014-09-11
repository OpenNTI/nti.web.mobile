/** @jsx React.DOM */
'use strict';

var React = require('react/addons');

var Video = require('../../common/components/Video');

module.exports = React.createClass({
	displayName: 'Title',

	render: function() {
		var e = this.props.entry || {};
		var videoURL = e.Video;
		return (
			<div className={'header ' + (videoURL? 'with-video' : '')}>
				{videoURL ? <Video src={videoURL}/> : null}
				<div className="title">{e.Title}</div>
			</div>
		);
	}
});
