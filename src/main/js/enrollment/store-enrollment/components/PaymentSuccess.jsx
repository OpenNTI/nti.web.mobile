import React from 'react';

import ErrorWidget from 'common/components/Error';

import CourseContentLink from 'library/components/CourseContentLink';

import GiftSuccess from './GiftSuccess';
import EnrollmentSuccess from '../../components/EnrollmentSuccess';

import {resetProcess} from '../Actions';
import Store from '../Store';

export default React.createClass({
	displayName: 'PaymentSuccess',

	propTypes: {
		courseId: React.PropTypes.string,
		purchasable: React.PropTypes.object.isRequired,
		giftDoneLink: React.PropTypes.string,
		onDone: React.PropTypes.func
	},


	getInitialState () {
		return {
			purchaseAttempt: null
		};
	},



	componentWillMount () {
		this.setState({
			purchaseAttempt: Store.getPaymentResult()
		});
	},


	componentDidMount () {
		if (!this.state.purchaseAttempt) {
			resetProcess();
		}
	},


	_courseLink () {
		return (
			<CourseContentLink
					className="button tiny radius column"
					courseId={this.props.courseId}>Go to course</CourseContentLink>
		);
	},

	render () {
		let {purchaseAttempt} = this.state;
		let {giftDoneLink, onDone, purchasable} = this.props;
		let {title = 'the course'} = purchasable || {};

		let isGift = (purchaseAttempt || {}).redemptionCode;

		if (!purchaseAttempt) {
			return <ErrorWidget error="No data"/>;
		}

		return isGift ? (
			<GiftSuccess
				purchasable={purchasable}
				purchaseattempt={purchaseAttempt}
				onDone={onDone}
				doneLink={giftDoneLink} />
		) : (
			<EnrollmentSuccess courseTitle={title} />
		);
	}

});
