/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var t = require('common/locale').scoped('ENROLLMENT.BUTTONS');
var Actions = require('../../Actions');

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