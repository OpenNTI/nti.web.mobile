'use strict';

var React = require('react/addons');
var t = require('common/locale').scoped('ENROLLMENT.BUTTONS');
var Actions = require('../../Actions');
var requiredProps = require('./RequiredProps');
var PanelButton = require('common/components/PanelButton');

var OpenEnrollmentWidget = React.createClass({

	propTypes: requiredProps,

	statics: {
		re: /OpenEnrollment/i,
		handles: function (options) {
			return this.re.test(options && options.key);
		}
	},

	_enroll: function(event) {
		event.preventDefault();
		Actions.enrollOpen(this.props.catalogEntry.getID());
	},

	render: function() {
		return (
			<PanelButton onClick={this._enroll} linkText={t(this.props.enrollmentOption.key)}>
				<h2>Enroll for Free</h2>
				<p>Get complete access to interact with all course content,
					including lectures, course materials, quizzes,
					and discussions once class is in session.
				</p>
			</PanelButton>
		);
	}

});

module.exports = OpenEnrollmentWidget;
