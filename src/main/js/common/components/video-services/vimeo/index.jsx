/** @jsx React.DOM */
'use strict';

var React = require('react/addons');

module.exports = React.createClass({
	displayName: 'Vimeo-Video',

	render: function() {
		return this.transferPropsTo(<iframe frameBorder="0" seemless allowfullscreen webkitallowfullscreen mozAllowFullScreen />);
	}
});
