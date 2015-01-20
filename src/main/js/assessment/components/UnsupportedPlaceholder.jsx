'use strict';

var React = require('react/addons');
var Placeholder = require('./Placeholder');

module.exports = React.createClass({
	displayName: 'UnSupprtedPlaceholder',


	propTypes: {
		assignment: React.PropTypes.object
	},


	onStart (e) {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}

		//Temp:
		history.go(-1);
	},


	render () {
		//You have <strong>5 minutes</strong> to complete this Timed Assignment.
		//<span className="red">Once you've started, the timer will not stop.</span>
		var {assignment} = this.props;

		var props = {
			assignment: assignment, 
			message: 'Assignments are not supported on this platform.',
			buttonLabel: 'Back',
			pageTitle: 'Not Supported'
		};

		return (
			<Placeholder {...props} />
		);
	}
});