/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var ErrorWidget = require('common/components/Error');

module.exports = React.createClass({
	displayName: 'IFrame-Video',

	render: function() {
		if (!this.props.src) {
			return (<ErrorWidget error="No source"/>);
		}
		return this.transferPropsTo(<iframe frameBorder="0" seemless allowfullscreen webkitallowfullscreen mozAllowFullScreen />);
	}
});
