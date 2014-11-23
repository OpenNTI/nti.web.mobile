/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');

var ErrorWidget = require('common/components/Error');

var CourseContentLink = require('library/components/CourseContentLink');

var GiftSuccess = require('./GiftSuccess');
var EnrollmentSuccess = require('./EnrollmentSuccess');

var Actions = require('../Actions');
var Store = require('../Store');

var PaymentSuccess = React.createClass({

	propTypes: {
		courseId: React.PropTypes.string,
		purchasable: React.PropTypes.object.isRequired
	},


	getInitialState: function() {
		return {
			purchaseAttempt: null
		};
	},



	componentWillMount: function() {
		this.setState({
			purchaseAttempt: Store.getPaymentResult()
		});
	},


	componentDidMount: function() {
		if (!this.state.purchaseAttempt) {
			Actions.resetProcess();
		}
	},


	_courseLink: function() {
		return <CourseContentLink
					className="button tiny radius column"
					courseId={this.props.courseId}>Go to course</CourseContentLink>;
	},

	render: function() {
		var attempt = this.state.purchaseAttempt;
		var isGift = (attempt || {}).RedemptionCode;

		if (!attempt) {
			return <ErrorWidget error="No data"/>;
		}

		return (
			<div>
				{isGift ?
					<GiftSuccess purchasable={this.props.purchasable} purchaseattempt={attempt}/> :
					<EnrollmentSuccess purchasable={this.props.purchasable} courseId={this.props.courseId} purchaseattempt={attempt} />
				}
			</div>
		);
	}

});

module.exports = PaymentSuccess;
