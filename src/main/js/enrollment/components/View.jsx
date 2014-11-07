/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var Router = require('react-router-component');

var Enroll = require('./Enroll');
var DropCourse = require('./DropCourse');
var EnrollStore = require('./EnrollStore');
var CatalogStore = require('library/catalog/Store');
var NTIID = require('dataserverinterface/utils/ntiids');

module.exports = React.createClass({
	displayName: 'enrollment:View',

	_getCourseId: function() {
		var id = NTIID.decodeFromURI(this.props.entryId);
		var entry = CatalogStore.getEntry(id);
		return entry.CourseNTIID;
	},

	render: function() {
    	return (
			<Router.Locations contextual>
				
				<Router.Location path="/drop/" handler={DropCourse}
					basePath={this.props.basePath}
					entryId={this.props.entryId}
					courseId={this._getCourseId()}/>
				
				<Router.Location
					path="/store/"
					handler={EnrollStore}
					basePath={this.props.basePath}
					entryId={this.props.entryId}
					courseId={this._getCourseId()} />
                
                <Router.Location
                	path="*"
                	handler={Enroll}
                	basePath={this.props.basePath}
                	entryId={this.props.entryId} />

			</Router.Locations>
	    );
	}
});
