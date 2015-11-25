import React from 'react';

import LocalizedHTML from 'common/components/LocalizedHTML';
import DateTime from 'common/components/DateTime';

import Pricing from './Pricing';
import {resetProcess} from '../Actions';

import Button from 'common/forms/components/Button';

import {scoped} from 'common/locale';

const t = scoped('ENROLLMENT.GIFT.SUCCESS');
const siteString = scoped('COURSE.CONTACTINFO');

export default React.createClass({
	displayName: 'GiftSuccess',

	propTypes: {
		purchasable: React.PropTypes.object,
		purchaseattempt: React.PropTypes.object,
		doneLink: React.PropTypes.string,
		onDone: React.PropTypes.func
	},

	componentWillUnmount () {
		resetProcess();
	},

	onNewGift () {
		resetProcess({
			gift: true
		});
	},

	ignoreChange  () {
		//replaces changes user made with current state (effectively making
		//the field readonly, while still letting it be focusable)
		this.forceUpdate();
	},

	render () {
		const {purchasable, purchaseattempt, doneLink} = this.props;
		const {title} = purchasable;
		const {receiver, sender, redemptionCode, transactionID} = purchaseattempt || {};
		const {VendorInfo: {StartDate} = {}} = purchasable || {};

		const date = DateTime.format(StartDate);
		const support = siteString('GIFTSUPPORT');

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
					<LocalizedHTML className="gift" stringId={`ENROLLMENT.GIFT.SUCCESS.${infoKey}`} sender={sender} receiver={receiver} />
					<p className="alert">{alert}</p>

					<LocalizedHTML className="prompt"
							stringId={`ENROLLMENT.GIFT.SUCCESS.${(date ? 'info' : 'infoNoDate')}`}
							courseTitle={title}
							startDate={date}/>

					<LocalizedHTML className="support"
							stringId="ENROLLMENT.GIFT.SUCCESS.support"
							email={support} />

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
					<Button onClick={onDone} href={doneLink}>I'm done</Button>
				</div>
			</div>
		);
	}
});
