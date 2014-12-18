/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var Router = require('react-router-component');
var PaymentComplete = require('./PaymentComplete');
var Admission = require('./Admission');

var View = React.createClass({

	render: function() {

		return (
			<Router.Locations contextual>
				<Router.Location
					path="/paymentcomplete/*"
					handler={PaymentComplete}
					basePath={this.props.basePath}
					entryId={this.props.entryId}
					courseId={this.props.courseId} />

				<Router.NotFound
					handler={Admission}
					enrollment={this.props.enrollment}
					basePath={this.props.basePath}
					entryId={this.props.entryId} />
			</Router.Locations>
		);
	}

});

module.exports = View;
