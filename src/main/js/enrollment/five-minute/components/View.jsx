'use strict';

var React = require('react/addons');
var Router = require('react-router-component');
var PaymentComplete = require('./PaymentComplete');
var ConcurrentSent = require('./ConcurrentSent');
var PanelButton = require('common/components/PanelButton');
var Admission = require('./Admission');
var CourseContentLink = require('library/components/CourseContentLinkMixin');
var Store = require('../Store');
var Constants = require('../Constants');
var NavigatableMixin = require('common/mixins/NavigatableMixin');

var View = React.createClass({

	mixins: [NavigatableMixin, CourseContentLink],

	componentDidMount: function() {
		Store.addChangeListener(this._storeChange);
	},

	componentWillUnmount: function() {
		Store.removeChangeListener(this._storeChange);
	},

	_storeChange: function(event) {
		switch(event.type) {
		//TODO: remove all switch statements, replace with functional object literals. No new switch statements.
			case Constants.events.CONCURRENT_ENROLLMENT_SUCCESS:
				this.navigate('credit/concurrent/');
				break;
		}
	},

	render: function() {

		if ((this.props.enrollment||{}).IsEnrolled) {

			var href = this.courseHref(this.props.courseId);

			return (
				<PanelButton href={href} linkText='Proceed to the course'>
					You are enrolled.
				</PanelButton>
			);
		}

		return (
			<Router.Locations contextual>

				<Router.Location
					path="/concurrent/*"
					handler={ConcurrentSent}
				/>
				<Router.Location
					path="/paymentcomplete/*"
					handler={PaymentComplete}
					entryId={this.props.entryId}
					courseId={this.props.courseId}
					enrollment={this.props.enrollment}
				/>

				<Router.NotFound
					handler={Admission}
					enrollment={this.props.enrollment}
					entryId={this.props.entryId}
				/>
			</Router.Locations>
		);
	}

});

module.exports = View;
