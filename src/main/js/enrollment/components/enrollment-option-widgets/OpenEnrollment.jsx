/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var t = require('common/locale').scoped('ENROLLMENT.BUTTONS');
var Actions = require('../../Actions');

var Notice = require('common/components/Notice');

var OpenEnrollmentWidget = React.createClass({

	propTypes: {
		catalogEntry: React.PropTypes.object.isRequired,
		enrollmentOption: React.PropTypes.object.isRequired
	},

	_enroll: function(event) {
		event.preventDefault();
		Actions.enrollOpen(this.props.catalogEntry.getID());
	},
	
	render: function() {
		return this.transferPropsTo(
			<div>
				<div className="panel radius">
					<h2>Enroll for Free</h2>
					<p>Get complete access to interact with all course content, including lectures, course materials, quizzed, and discussions once class is in session</p>
				</div>
				<a href="#" onClick={this._enroll} className="button tiny radius column">{t(this.props.enrollmentOption.key)}</a>
			</div>
		);
		return React.DOM.a({
				href: "#",
				onClick: this._enroll,
				className: "button tiny radius column"	
			},
			t(this.props.enrollmentOption.key)
		);
	}

});

module.exports = OpenEnrollmentWidget;