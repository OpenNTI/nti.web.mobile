import React from 'react';
import PropTypes from 'prop-types';
import {DateTime} from 'nti-web-commons';
import {scoped} from 'nti-lib-locale';
import {rawContent} from 'nti-commons';

import Button from 'forms/components/Button';

import {resetProcess} from '../Actions';

import Pricing from './Pricing';


const siteString = scoped('course.contactInfo');
const t = scoped('enrollment.gift.success', {
	title: 'Gift Purchase Successful',
	info: '<strong>%(courseTitle)s</strong> starts on <strong>%(startDate)s</strong> and will be conducted fully online.',
	infoNoDate: '<strong>%(courseTitle)s</strong> will be conducted fully online.',
	toSender: 'We’ve sent an email of this transaction to you at <a>%(sender)s</a>. ' +
				'We’ve also sent a separate email that contains instructions on how to redeem this gift.',
	alert: 'Please be sure to pass this information along to the gift recipient in time to take advantage of the course.',
	toRecipient: 'We’ve sent an email of this transaction to you at <a>%(sender)s</a>. ' +
					'We’ve also sent you a copy of the gift notification that was sent to <a>%(receiver)s</a> ' +
					'with instructions on how to redeem this gift.',
	support: 'Please contact %(email)s if you have any issues.',
	transactionID: 'Transaction ID:',
	accessKey: 'Access Key:',
	supportPrompt: 'Please contact tech support if you have any issues.'
});

export default class extends React.Component {
	static displayName = 'GiftSuccess';

	static propTypes = {
		purchasable: PropTypes.object,
		purchaseattempt: PropTypes.object,
		doneLink: PropTypes.string,
		onDone: PropTypes.func
	};

	componentWillUnmount () {
		resetProcess();
	}

	onNewGift = () => {
		resetProcess({
			gift: true
		});
	};

	ignoreChange = () => {
		//replaces changes user made with current state (effectively making
		//the field readonly, while still letting it be focusable)
		this.forceUpdate();
	};

	render () {
		const {purchasable, purchaseattempt, doneLink} = this.props;
		const {title} = purchasable;
		const {receiver, sender, redemptionCode, transactionID} = purchaseattempt || {};
		const {vendorInfo} = purchasable || {};

		const startDate = vendorInfo && vendorInfo.getStartDate();

		const date = DateTime.format(startDate);
		const support = siteString('GiftSupport');

		let {onDone} = this.props;
		if (typeof onDone !== 'function') {
			onDone = void 0;
		}

		let alert;
		let infoKey;

		if (receiver) {
			infoKey = 'toRecipient';
		} else {
			infoKey = 'toSender';
			alert = t('alert');
		}


		const {VendorThankYouPage: {thankYouURL} = {}} = purchaseattempt;

		return (
			<div className="gift-success">
				<Pricing purchasable={purchasable} locked />
				{!thankYouURL ? null : (<iframe src={thankYouURL} className="thankyou" frameBorder="0"/>)}
				<div className="panel">
					<h3 className="header">{t('title')}</h3>
					<div className="gift" {...rawContent(t(infoKey, {sender, receiver}))} />
					<p className="alert">{alert}</p>

					<div className="prompt"
						{...rawContent(t(date ? 'info' : 'infoNoDate', {courseTitle: title, startDate: date}))} />

					<div className="support"
						{...rawContent(t('support', {email: support}))} />

					<div className="token">
						<span className="label">{t('accessKey')}</span>
						<input type="text" className="value" value={redemptionCode} onChange={this.ignoreChange}/>
					</div>
					<div className="token">
						<span className="label">{t('transactionID')}</span>
						<input type="text" className="value" value={transactionID} onChange={this.ignoreChange} />
					</div>
				</div>
				<div className="actions">
					<Button onClick={this.onNewGift}>Purchase another Gift</Button>
					<Button onClick={onDone} href={doneLink}>I’m done</Button>
				</div>
			</div>
		);
	}
}
