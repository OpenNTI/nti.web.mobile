import React from 'react';

import DateMixin from 'enrollment/mixins/Dates';

import LocalizedHTML from 'common/components/LocalizedHTML';

import Pricing from './Pricing';
import {resetProcess} from '../Actions';

import Button from 'common/forms/components/Button';

import {scoped} from 'common/locale';

const t = scoped('ENROLLMENT.GIFT.SUCCESS');
const siteString = scoped('COURSE.CONTACTINFO');

export default React.createClass({
	displayName: 'GiftSuccess',
	mixins: [DateMixin],

	propTypes: {
		purchasable: React.PropTypes.object,
		purchaseattempt: React.PropTypes.object,
		doneLink: React.PropTypes.string,
		onDone: React.PropTypes.func
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
		let {purchasable, purchaseattempt, onDone, doneLink} = this.props;
		let {title} = purchasable;
		let {receiver, sender, redemptionCode, transactionID} = purchaseattempt || {};
		let {VendorInfo} = purchasable || {};

		let date = this.getDate(VendorInfo && VendorInfo.StartDate);
		let alert;
		let infoKey;
		let support = siteString('GIFTSUPPORT');

		if (receiver) {
			infoKey = 'toRecipient';
		} else {
			infoKey = 'toSender';
			alert = t('alert');
		}

		if (typeof onDone !== 'function') {
			onDone = void 0;
		}

		const {VendorThankYouPage: {thankYouURL} = {}} = purchaseattempt;

		return (
			<div className="gift-success row">
				<Pricing purchasable={purchasable} locked />
				{!thankYouURL ? null : (<iframe src={thankYouURL} className="thankyou" frameBorder="0"/>)}
				<div className="medium-8 medium-centered columns panel">
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
				<div className="medium-8 medium-centered columns row actions">
					<div className="small-12 medium-6 columns">
						<Button onClick={this.onNewGift}>Purchase another Gift</Button>
					</div>
					<div className="small-12 medium-6 columns">
						<Button onClick={onDone} href={doneLink}>I'm done</Button>
					</div>
				</div>
			</div>
		);
	}
});
