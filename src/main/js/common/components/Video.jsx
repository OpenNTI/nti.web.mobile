/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var Providers = require('./video-services');

module.exports = React.createClass({
	displayName: 'Video',

	render: function() {
		var Provider = Providers.getHandler(this.props.src || this.props.data);
		var videoSource = ((this.props.data || {}).sources || {})[0];

		return (
			<div className={'flex-video widescreen ' + Provider.name}>
				{this.transferPropsTo(<Provider src={this.props.src} data={videoSource}/>)}
			</div>
		);
	}
});
