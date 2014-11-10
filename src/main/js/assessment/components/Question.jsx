/** @jsx React.DOM */
'use strict';

var React = require('react/addons');

var Part = require('./Part');

module.exports = React.createClass({
	displayName: 'Question',

	propTypes: {
		question: React.PropTypes.object
	},


	render: function() {
		var q = this.props.question || {};
		var parts = q.parts || [];

		console.log(this.props);

		return (
			<div>
				<div dangerouslySetInnerHTML={{__html: q.content}}/>
				{parts.map(function(part, i) {
					return Part({key: 'part-'+i, part: part, index: i, partCount: parts.length});
				})}
				<hr/>
			</div>
		);
	}
});
