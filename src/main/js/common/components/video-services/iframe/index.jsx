/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var Error = require('common/components/Error');

module.exports = React.createClass({
	displayName: 'IFrame-Video',

	render: function() {
		if (!this.props.src) {
			return (<Error error="No source"/>)
		}
		return this.transferPropsTo(<iframe frameBorder="0" seemless allowfullscreen webkitallowfullscreen mozAllowFullScreen />);
	}
});
