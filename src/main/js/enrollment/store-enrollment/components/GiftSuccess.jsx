/** @jsx React.DOM */

'use strict';

var React = require('react/addons');

var LocalizedHTML = require('common/components/LocalizedHTML');

var _t = require('common/locale').scoped('ENROLLMENT.GIFT.SUCCESS');

module.exports = React.createClass({
	displayName: 'GiftSuccess',

	render: function() {
		var courseTitle = this.props.purchasable.Title;
		var purchaseAttempt = this.props.purchaseattempt;
		var email = purchaseAttempt && purchaseAttempt.Receiver;
		var name = purchaseAttempt && purchaseAttempt.ReceiverName;
		var infoKey;

		if (name) {
			infoKey = 'toName';
		} else {
			infoKey = 'toEmail';
			email = email || purchaseAttempt.Creator;
		}

		return (
			<div>
				<div className="header">{_t("title")}</div>
				<LocalizedHTML key="info" scoped="ENROLLMENT.GIFT.SUCCESS" courseTitle={courseTitle} />
				<LocalizedHTML key={infoKey} scoped="ENROLLMENT.GIFT.SUCCESS" name={name} email={email} />
				<div>
					<span className="label">Access Key</span>
					<span className="value">{purchaseAttempt.RedemptionCode}</span>
				</div>
				<div>
					<span className="label">Transaction ID</span>
					<span classname="value">{purchaseAttempt.TransactionID}</span>
				</div>
			</div>
		);
	}
});
