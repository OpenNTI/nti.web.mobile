/** @jsx React.DOM */

'use strict';

var React = require('react/addons');

var _t = require('common/locale').scoped('ENROLLMENT.GIFT.PRICING');

var Store = require('../Store');
var Actions = require('../Actions');
var Constants = require('../Constants');
var FormattedPriceMixin = require('enrollment/mixins/FormattedPriceMixin');

module.exports = React.createClass({
	displayName: 'Pricing',

	mixins: [FormattedPriceMixin],

	propTypes: {
		purchasable: React.PropTypes.object.isRequired
	},

	getInitialState: function() {
		return {
			currency: this.props.purchasable.Currency,
			currentPrice: this.props.purchasable.Amount,
			oldPrice: null,
			triedCoupon: false,
			couponDiscount: ''
		};
	},


	componentDidMount: function() {
		Store.addChangeListener(this._onChange);
	},


	componentWillUnmount: function() {
		Store.removeChangeListener(this._onChange);
	},


	_onChange: function(e) {
		var pricing = e.pricing,
			discount;

		if (e.type === Constants.VALID_COUPON) {
			if (pricing.Coupon.PercentOff) {
				discount = pricing.Coupon.PercentOff + '%';
			} else if (pricing.Coupon.AmountOff) {
				discount = this.getFormattedPrice(pricing.Coupon.Currency, pricing.Coupon.AmountOff);
			}

			this.setState({
				currentPrice: pricing.PurchasePrice,
				oldPrice: pricing.Amount,
				triedCoupon: true,
				couponDiscount: discount
			});

		} else if (e.type === Constants.INVALID_COUPON) {
			if (e.coupon === '') {
				this.setState({
					triedCoupon: false,
					couponDiscount: '',
					oldPrice: null,
					currentPrice: this.props.purchasable.Amount
				});
			} else {
				this.setState({
					triedCoupon: true,
					couponDiscount: '',
					oldPrice: null,
					currentPrice: this.props.purchasable.Amount
				});
			}
		}
	},


	getData: function() {
		return {
			coupon: this.state.coupon
		};
	},


	onCouponChanged: function () {
		var couponRef = this.refs.coupon,
			couponEl = couponRef && couponRef.isMounted() && couponRef.getDOMNode(),
			coupon = couponEl && couponEl.value;

		this.setState({
			coupon: coupon
		});

		Actions.updateCoupon(this.props.purchasable, coupon);
	},


	render: function() {

		var type = 'Lifelong Learner - Gift';
		var startDate = 'Start Date';
		var endDate = 'End Date';
		var creditHours= 'No College Credit';
		var refund = _t('noRefunds');
		var oldTotal = this.state.oldPrice && this.getFormattedPrice(this.state.currency, this.state.oldPrice);
		var total = this.getFormattedPrice(this.state.currency, this.state.currentPrice || 0);
		var discount = this.state.couponDiscount || '';
		var couponLabel = _t('coupon');
		var couponLabelCls = '';

		if (this.state.triedCoupon) {
			if (this.state.couponDiscount) {
				couponLabelCls = 'valid';
				couponLabel = _t('validCoupon', {discount:discount});
			} else {
				couponLabelCls = 'invalid';
				couponLabel = _t('invalidCoupon');
			}
		}

		return (
			<div className="pricing-info">
				<div className="title">
					<span className="sub">{_t("subType")}</span>
					<span className="main">{type}</span>
				</div>
				<div className="info">
					<div className="row">
						<div>
							<span className="label">{_t("begins")}</span>
							<span className="value">{startDate}</span>
						</div>
						<div>
							<span className="label">{_t("ends")}</span>
							<span className="value">{endDate}</span>
						</div>
					</div>
					<div className="row">
						<div>
							<span className="label">{_t("hours")}</span>
							<span className="value">{creditHours}</span>
						</div>
						<div>
							<span className="label">{_t("refunds")}</span>
							<span className="value">{refund}</span>
						</div>
					</div>
					<div>
						<div className="total">
							<span className="label">{_t("total")}</span>
							<span className="old-amount">{oldTotal}</span>
							<span className="amount">{total}</span>
						</div>
						<div className="coupon">
							<span className={"label " + couponLabelCls}>{couponLabel}</span>
							<input type="text" ref="coupon" name="coupon" placeholder={_t("couponPlaceholder")} onChange={this.onCouponChanged} value={this.state.coupon}/>
						</div>
					</div>
				</div>
			</div>
		);
	}
});
