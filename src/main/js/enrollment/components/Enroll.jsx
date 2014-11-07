/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var EnrollmentOptions = require('library/catalog/mixins/EnrollmentMixin');
var Loading = require('common/components/Loading');


var Enroll = React.createClass({

	mixins: [EnrollmentOptions],

	// componentDidMount: function() {
	// 	EnrollmentStore.addChangeListener(this._updateEnrollmentStatus);
	// 	this.getDataIfNeeded();
	// 	this._updateEnrollmentStatus();
	// },

	// componentWillUnmount: function() {
	// 	EnrollmentStore.removeChangeListener(this._updateEnrollmentStatus);
	// },

	render: function() {

		if (!this.state.enrollmentStatusLoaded) {
			return <Loading />;
		}

		if(this.state.enrolled) {
			return <div>You are already enrolled.</div>;
		}

		// var options = this.enrollmentOptions(this.state.entry).map(function(item,index) {
		// 	return <li key={'en_' + index}>enrollment option: {item.label}</li>;
		// });

		var widgets = this.enrollmentWidgets();

		return (
			<div>
				{widgets}
			</div>
		);
	}

});

module.exports = Enroll;
