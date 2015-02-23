'use strict';

var React = require('react');
var Router = require('react-router-component');

var Enroll = require('./Enroll');
var DropCourse = require('./DropCourse');
var StoreEnrollment = require('../store-enrollment/components/View');
var CreditEnrollment = require('../five-minute/components/View');
var CatalogStore = require('catalog/Store');
var Constants = require('../Constants');
var {decodeFromURI} = require('dataserverinterface/utils/ntiids');


function getEntry(entryId) {
	return CatalogStore.getEntry(decodeFromURI(entryId));
}


module.exports = React.createClass({
	displayName: 'enrollment:View',

	_getCourseId: function() {
		return (getEntry(this.props.entryId)||{}).CourseNTIID;
	},

	_getEnrollmentOption: function(key) {
		var entry = getEntry(this.props.entryId);
		if (entry && entry.EnrollmentOptions) {
			return entry.EnrollmentOptions.Items[key];
		}
		return null;
	},

	render: function() {
    	return (
			<Router.Locations contextual>

				<Router.Location path="/drop/" handler={DropCourse}
					entryId={this.props.entryId}
					courseId={this._getCourseId()}/>

				<Router.Location
					path="/store(/*)"
					handler={StoreEnrollment}
					entryId={this.props.entryId}
					enrollment={this._getEnrollmentOption(Constants.StoreEnrollment)}
					courseId={this._getCourseId()} />

				<Router.Location
					path="/credit(/*)"
					handler={CreditEnrollment}
					entryId={this.props.entryId}
					enrollment={this._getEnrollmentOption(Constants.FiveminuteEnrollment)}
					courseId={this._getCourseId()} />

                <Router.NotFound
                	handler={Enroll}
                	entryId={this.props.entryId} />

			</Router.Locations>
	    );
	}
});
