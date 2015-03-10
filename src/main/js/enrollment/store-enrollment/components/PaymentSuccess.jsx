'use strict';

var React = require('react');

var ErrorWidget = require('common/components/Error');

var CourseContentLink = require('library/components/CourseContentLink');

var GiftSuccess = require('./GiftSuccess');
var EnrollmentSuccess = require('../../components/EnrollmentSuccess');

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
		var {purchaseAttempt} = this.state;
		var {purchasable} = this.props;
		var title = (purchasable || {}).Title || '[Course Title]';

		var isGift = (purchaseAttempt || {}).RedemptionCode;

		if (!purchaseAttempt) {
			return <ErrorWidget error="No data"/>;
		}

		return (
			<div>
				{isGift ?
					<GiftSuccess
						purchasable={purchasable}
						purchaseattempt={purchaseAttempt}
						onDone={this.props.onDone}
						doneLink={this.props.giftDoneLink} /> :
					<EnrollmentSuccess courseTitle={title} />
				}
			</div>
		);
	}

});

module.exports = PaymentSuccess;
