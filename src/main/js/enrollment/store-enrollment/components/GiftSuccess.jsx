import React from 'react';

import DateMixin from 'enrollment/mixins/Dates';

import LocalizedHTML from 'common/components/LocalizedHTML';

import Pricing from './Pricing';
import {resetProcess} from '../Actions';

import Button from 'common/forms/components/Button';

import {scoped} from 'common/locale';

const t = scoped('ENROLLMENT.GIFT.SUCCESS');
const siteString = scoped('CONTACTINFO');

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
		let courseTitle = this.props.purchasable.Title;
		let purchaseAttempt = this.props.purchaseattempt;

		let receiver = purchaseAttempt && purchaseAttempt.Receiver;
		let sender = purchaseAttempt && purchaseAttempt.Creator;

		let vendorInfo = this.props.purchasable && this.props.purchasable.VendorInfo;
		let date = this.getDate(vendorInfo && vendorInfo.StartDate);
		let alert;
		let infoKey;
		let support = siteString('GIFTSUPPORT');

		if (receiver) {
			infoKey = 'toRecipient';
		} else {
			infoKey = 'toSender';
			alert = t('alert');
		}

		return (
			<div className="gift-success row">
				<Pricing purchasable={this.props.purchasable} locked={true} />
				<div className="medium-8 medium-centered columns panel">
					<h3 className="header">{t('title')}</h3>
					<LocalizedHTML className="gift" stringId={infoKey} scoped="ENROLLMENT.GIFT.SUCCESS" sender={sender} receiver={receiver} />
					<p className="alert">{alert}</p>
					<LocalizedHTML className="prompt"
							stringId="info"
							scoped="ENROLLMENT.GIFT.SUCCESS"
							courseTitle={courseTitle}
							startDate={date}/>
					<LocalizedHTML className="support"
							stringId="support"
							scoped="ENROLLMENT.GIFT.SUCCESS"
							email={support} />

					<div className="token">
						<span className="label">{t('accessKey')}</span>
						<input type="text" className="value" value={purchaseAttempt.RedemptionCode} onChange={this.ignoreChange}/>
					</div>
					<div className="token">
						<span className="label">{t('transactionID')}</span>
						<input type="text" className="value" value={purchaseAttempt.TransactionID} onChange={this.ignoreChange} />
					</div>
				</div>
				<div className="medium-8 medium-centered columns row actions">
					<div className="small-12 medium-6 columns">
						<Button onClick={this.onNewGift}>Purchase another Gift</Button>
					</div>
					<div className="small-12 medium-6 columns">
						<Button href={this.props.doneLink} onClick={this.props.onDone}>I'm done</Button>
					</div>
				</div>
			</div>
		);
	}
});
