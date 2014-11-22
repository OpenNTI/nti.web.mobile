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

var _purchaseAttempt;

var PaymentSuccess = React.createClass({

	propTypes: {
		courseId: React.PropTypes.string,
		purchasable: React.PropTypes.object.isRequired
	},


	componentWillMount: function() {
		_purchaseAttempt = Store.getPaymentResult();
	},


	componentDidMount: function() {
		if (!_purchaseAttempt) {
			Actions.resetProcess();
		}
	},


	_courseLink: function() {
		return <CourseContentLink
					className="button tiny radius column"
					courseId={this.props.courseId}>Go to course</CourseContentLink>;
	},

	render: function() {
		var isGift = _purchaseAttempt && _purchaseAttempt.RedemptionCode;

		if (_purchaseAttempt) {
			return <ErrorWidget error="No data"/>;
		}

		return (
			<div>
				{isGift ?
					<GiftSuccess purchasable={this.props.purchasable} purchaseattempt={_purchaseAttempt}/> :
					<EnrollmentSuccess purchasable={this.props.purchasable} courseId={this.props.courseId} purchaseattempt={_purchaseAttempt} />
				}
			</div>
		);
	}

});

module.exports = PaymentSuccess;
