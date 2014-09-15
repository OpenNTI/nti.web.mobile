/** @jsx React.DOM */
'use strict';

var React = require('react/addons');

module.exports = React.createClass({
	displayName: 'YouTube-Video',

	render: function() {
		return this.transferPropsTo(<iframe frameBorder="0" seemless allowfullscreen webkitallowfullscreen mozAllowFullScreen />);
	}
});
