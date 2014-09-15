/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var Providers = require('./video-services');

module.exports = React.createClass({
	displayName: 'Video',

	render: function() {
		var Provider = Providers.getHandler(this.props.src);

		return (
			<div className="flex-video widescreen {Provider.name}">
				<Provider src={this.props.src} />
			</div>
		);
	}
});
