/** @jsx React.DOM */
'use strict';

var React = require('react/addons');

var Video = require('video').Component;


module.exports = React.createClass({
	displayName: 'Title',

	render: function() {
		var e = this.props.entry || {};
		var videoURL = e.Video;
		var context = [e.getID()];
		return (
			<div className={'header ' + (videoURL? 'with-video' : '')}>
				{videoURL ?
					<div className="row">
						<div className="columns video-wrap">
							<Video src={videoURL} context={context}/>
						</div>
					</div> : null}

				<div className="title">
					<div className="row">
						<div className="columns text">{e.Title}</div>
					</div>
				</div>
			</div>
		);
	}
});
