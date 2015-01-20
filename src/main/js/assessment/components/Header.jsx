'use strict';

var React = require('react/addons');

var AssignmentHeader = require('./HeaderAssignment');
var ScoreboardHeader = require('./HeaderScoreboard');
var UnsupportedPlaceholder = require('./UnsupportedPlaceholder');

var Store = require('../Store');

module.exports = React.createClass({
	displayName: 'SetHeader',

	render: function() {
		var assessment = this.props.assessment;
		var Component = Store.isAssignment(assessment) ?
							AssignmentHeader : ScoreboardHeader;

		if (!Store.areAssessmentsSupported()) {
			return (
				<UnsupportedPlaceholder assignment={assessment}/>
			);
		}

		return (
			<Component assessment={assessment}/>
		);
	}
});
