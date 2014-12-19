/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var Router = require('react-router-component');
var PaymentComplete = require('./PaymentComplete');
var PanelButton = require('common/components/PanelButton');
var Admission = require('./Admission');
var CourseContentLink = require('library/components/CourseContentLink');

var View = React.createClass({

	render: function() {

		if ((this.props.enrollment||{}).IsEnrolled) {

			var href = CourseContentLink.courseHref(this.props.courseId);

			return (
				<PanelButton href={href} linkText='Proceed to the course'>
					You are enrolled.
				</PanelButton>
			);
		}

		return (
			<Router.Locations contextual>
				<Router.Location
					path="/paymentcomplete/*"
					handler={PaymentComplete}
					basePath={this.props.basePath}
					entryId={this.props.entryId}
					courseId={this.props.courseId} 
					enrollment={this.props.enrollment}
				/>

				<Router.NotFound
					handler={Admission}
					enrollment={this.props.enrollment}
					basePath={this.props.basePath}
					entryId={this.props.entryId}
				/>
			</Router.Locations>
		);
	}

});

module.exports = View;
