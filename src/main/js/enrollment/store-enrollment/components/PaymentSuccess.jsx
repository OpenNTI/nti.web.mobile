import React from 'react';

import {Error as ErrorWidget} from 'nti-web-commons';

import CourseContentLink from 'library/components/CourseContentLink';

import GiftSuccess from './GiftSuccess';
import EnrollmentSuccess from '../../components/EnrollmentSuccess';

import {resetProcess} from '../Actions';
import Store from '../Store';

export default class extends React.Component {
    static displayName = 'PaymentSuccess';

    static propTypes = {
		courseId: React.PropTypes.string,
		purchasable: React.PropTypes.object.isRequired,
		giftDoneLink: React.PropTypes.string,
		onDone: React.PropTypes.func
	};

    state = {
        purchaseAttempt: null
    };

    componentWillMount() {
		this.setState({
			purchaseAttempt: Store.getPaymentResult()
		});
	}

    componentWillUnmount() {
		resetProcess();
	}

    componentDidMount() {
		if (!this.state.purchaseAttempt) {
			resetProcess();
		}
	}

    _courseLink = () => {
		return (
			<CourseContentLink
					className="button tiny radius column"
					courseId={this.props.courseId}>Go to course</CourseContentLink>
		);
	};

    render() {
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
}
