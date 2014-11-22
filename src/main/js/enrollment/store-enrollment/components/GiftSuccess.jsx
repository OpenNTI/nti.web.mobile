/** @jsx React.DOM */

'use strict';

var React = require('react/addons');

var DateMixin = require('enrollment/mixins/Dates');

var LocalizedHTML = require('common/components/LocalizedHTML');

var Pricing = require('./Pricing');

var _t = require('common/locale').scoped('ENROLLMENT.GIFT.SUCCESS');
var _siteT = require('common/locale').scoped('CONTACTINFO');

module.exports = React.createClass({
	displayName: 'GiftSuccess',

	mixins: [DateMixin],

	render: function() {
		var courseTitle = this.props.purchasable.Title;
		var purchaseAttempt = this.props.purchaseattempt;
		var email = purchaseAttempt && purchaseAttempt.Receiver;
		var name = purchaseAttempt && purchaseAttempt.ReceiverName;
		var vendorInfo = this.props.purchasable && this.props.purchasable.VendorInfo;
		var date = this.getDate(vendorInfo && vendorInfo.StartDate);
		var infoKey;

		if (name) {
			infoKey = 'toName';
		} else {
			infoKey = 'toEmail';
			email = email || purchaseAttempt.Creator;
		}

		return (
			<div className="gift-success row">
				<Pricing purchasable={this.props.purchasable} locked={true} />
				<div className="medium-8 medium-centered columns">
					<h3 className="header">{_t("title")}</h3>
					<LocalizedHTML className="prompt" key="info" scoped="ENROLLMENT.GIFT.SUCCESS" courseTitle={courseTitle} startDate={date}/>
					<LocalizedHTML className="gift" key={infoKey} scoped="ENROLLMENT.GIFT.SUCCESS" name={name} email={email} />
					<div className="token">
						<span className="label">{_t("accessKey")}</span>
						<input type="text" readonly className="value" value={purchaseAttempt.RedemptionCode} />
					</div>
					<div className="token">
						<span className="label">{_t("transactionID")}</span>
						<input type="text" readonly className="value" value={purchaseAttempt.TransactionID} />
					</div>
					<div className="support">
						<span className="prompt">{_t("supportPrompt")}</span>
						<span className="phone">{_siteT("phone")}</span>
						<a className="link" href={_siteT("LINK1").link}>{_siteT("LINK1").label}</a>
						<a className="link" href={_siteT("LINK2").link}>{_siteT("LINK2").label}</a>
					</div>
				</div>
			</div>
		);
	}
});
