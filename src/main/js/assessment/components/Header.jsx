'use strict';

var React = require('react');

var AssignmentHeader = require('./HeaderAssignment');
var ScoreboardHeader = require('./HeaderScoreboard');
var UnsupportedPlaceholder = require('./UnsupportedPlaceholder');

var Utils = require('../Utils');

module.exports = React.createClass({
	displayName: 'SetHeader',

	render: function() {
		var assessment = this.props.assessment;
		var Component = Utils.isAssignment(assessment) ?
							AssignmentHeader : ScoreboardHeader;

		if (!Utils.areAssessmentsSupported()) {
			return (
				<UnsupportedPlaceholder assignment={assessment}/>
			);
		}

		return (
			<Component assessment={assessment}/>
		);
	}
});
