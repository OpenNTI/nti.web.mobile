/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');

var CourseContentLink = require('library/components/CourseContentLink');

var GiftSuccess = require('./GiftSuccess');
var EnrollmentSuccess = require('./EnrollmentSuccess');
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


	_courseLink: function() {
		return <CourseContentLink
					className="button tiny radius column"
					courseId={this.props.courseId}>Go to course</CourseContentLink>;
	},

	render: function() {
		var isGift = _purchaseAttempt && _purchaseAttempt.RedemptionCode;

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
