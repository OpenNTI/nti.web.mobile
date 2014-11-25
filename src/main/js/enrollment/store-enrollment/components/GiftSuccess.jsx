/** @jsx React.DOM */

'use strict';

var React = require('react/addons');

var DateMixin = require('enrollment/mixins/Dates');

var LocalizedHTML = require('common/components/LocalizedHTML');

var Pricing = require('./Pricing');
var Actions = require('../Actions');

var Button = require('common/components/forms/Button');

var _t = require('common/locale').scoped('ENROLLMENT.GIFT.SUCCESS');
var _siteT = require('common/locale').scoped('CONTACTINFO');

module.exports = React.createClass({
	displayName: 'GiftSuccess',

	mixins: [DateMixin],


	onNewGift: function() {
		Actions.resetProcess({
			gift: true
		});
	},

	render: function() {
		var courseTitle = this.props.purchasable.Title;
		var purchaseAttempt = this.props.purchaseattempt;
		var receiver = purchaseAttempt && purchaseAttempt.Receiver;
		var sender = purchaseAttempt && purchaseAttempt.Creator;
		var vendorInfo = this.props.purchasable && this.props.purchasable.VendorInfo;
		var date = this.getDate(vendorInfo && vendorInfo.StartDate);
		var alert;
		var infoKey;
		var support = _siteT("GIFTSUPPORT");

		if (receiver) {
			infoKey = 'toRecipient';
		} else {
			infoKey = 'toSender';
			alert = _t("alert");
		}

		return (
			<div className="gift-success row">
				<Pricing purchasable={this.props.purchasable} locked={true} />
				<div className="medium-8 medium-centered columns panel">
					<h3 className="header">{_t("title")}</h3>
					<LocalizedHTML className="gift" key={infoKey} scoped="ENROLLMENT.GIFT.SUCCESS" sender={sender} receiver={receiver} />
					<p className="alert">{alert}</p>
					<LocalizedHTML className="prompt" key="info" scoped="ENROLLMENT.GIFT.SUCCESS" courseTitle={courseTitle} startDate={date}/>
					<LocalizedHTML className="support" key="support" scoped="ENROLLMENT.GIFT.SUCCESS" email={support} />

					<div className="token">
						<span className="label">{_t("accessKey")}</span>
						<input type="text" readOnly className="value" value={purchaseAttempt.RedemptionCode} />
					</div>
					<div className="token">
						<span className="label">{_t("transactionID")}</span>
						<input type="text" readOnly className="value" value={purchaseAttempt.TransactionID} />
					</div>
				</div>
				<div className="medium-8 medium-centered columns row actions">
					<div className="small-12 medium-6 columns">
						<Button onClick={this.onNewGift}>Purchase another Gift</Button>
					</div>
					<div className="small-12 medium-6 columns">
						<Button onClick={this.props.onDone}>I'm done</Button>
					</div>
				</div>
			</div>
		);
	}
});
