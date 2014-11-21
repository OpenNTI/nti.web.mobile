/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
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
		var courseId = this.props.purchasable.Items[0];

		return (
			<div>
				{isGift ?
					<GiftSuccess purchasable={this.props.purchasable} purchaseattempt={_purchaseAttempt}/> :
					<EnrollmentSuccess purchasable={this.props.purchasable} courseId={courseId} purchaseattempt={_purchaseAttempt} />
				}
			</div>
		);
	}

});

module.exports = PaymentSuccess;
