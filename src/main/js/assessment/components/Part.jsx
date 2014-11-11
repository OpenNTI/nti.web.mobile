/** @jsx React.DOM */
'use strict';

var React = require('react/addons');

var InputTypes = require('./input-types');

module.exports = React.createClass({
	displayName: 'Part',

	propTypes: {
		index: React.PropTypes.number.isRequired,
		part: React.PropTypes.object.isRequired
	},


	render: function() {
		var props = this.props;
		var part = props.part || {};
		var index = props.index;
		return (
			<div className="question-part">
				<div className="part-content" dangerouslySetInnerHTML={{__html: part.content}}/>
				{InputTypes.select(part, index)}
			</div>
		);
	}
});
