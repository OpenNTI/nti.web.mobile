/** @jsx React.DOM */
'use strict';

var React = require('react/addons');

module.exports = React.createClass({
	displayName: 'Question',

	render: function() {
		var q = this.props.question || {};
		return (
			<div dangerouslySetInnerHTML={{__html: q.content}}/>
		);
	}
});
