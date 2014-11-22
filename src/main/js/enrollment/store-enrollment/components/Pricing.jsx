/** @jsx React.DOM */

'use strict';

var React = require('react/addons');

var _t = require('common/locale').scoped('ENROLLMENT.GIFT.PRICING');

var Store = require('../Store');
var Actions = require('../Actions');
var Constants = require('../Constants');
var FormattedPriceMixin = require('enrollment/mixins/FormattedPriceMixin');
var DateMixin = require('enrollment/mixins/Dates');

module.exports = React.createClass({
	displayName: 'Pricing',

	mixins: [FormattedPriceMixin, DateMixin],

	propTypes: {
		purchasable: React.PropTypes.object.isRequired
	},

	getInitialState: function() {
		var pricing = this.getCouponPricing();
		var state = {
				currency: this.props.purchasable.Currency,
				currentPrice: this.props.purchasable.Amount,
				triedCoupon: false,
				couponDiscount: false,
				checkingCoupon: false
			};

		if (this.props.locked) {
			state.coupon = _t("noCoupon");
		}


		if (pricing) {
			state.coupon = pricing.Coupon.ID;
			state.couponDiscount = this._getDiscountString(pricing.Coupon);
			state.oldPrice = pricing.Amount;
			state.currentPrice = pricing.PurchasePrice;
			state.triedCoupon = true;
		}

		return state;
	},


	componentDidMount: function() {
		//if (!this.props.locked) {
			Store.addChangeListener(this._onChange);
		//}
	},


	componentWillUnmount: function() {
		//if (!this.props.locked) {
			Store.removeChangeListener(this._onChange);
		//}
	},


	getCouponPricing: function() {
		return Store.getCouponPricing();
	},


	_getDiscountString: function(coupon) {
		var discount = '';

		if (coupon.PercentOff) {
			discount = coupon.PercentOff + '%';
		} else if (coupon.AmountOff) {
			discount = this.getFormattedPrice(coupon.Currency, coupon.AmountOff / 100);
		}
	
		return discount;
	},


	_onChange: function(e) {
		var pricing = e.pricing,
			discount;

		if (!this.isMounted() || this.props.locked) { return; }

		if (e.type === Constants.VALID_COUPON) {
			discount = this._getDiscountString(pricing.Coupon);

			this.setState({
				currentPrice: pricing.PurchasePrice,
				oldPrice: pricing.Amount,
				triedCoupon: true,
				couponDiscount: discount,
				checkingCoupon: false
			});
		} else if (e.type === Constants.INVALID_COUPON) {
			if (e.coupon === '') {
				this.setState({
					triedCoupon: false,
					couponDiscount: '',
					oldPrice: null,
					currentPrice: this.props.purchasable.Amount,
					checkingCoupon: false
				});
			} else {
				this.setState({
					triedCoupon: true,
					couponDiscount: '',
					oldPrice: null,
					currentPrice: this.props.purchasable.Amount,
					checkingCoupon: false
				});
			}
		}
	},


	getData: function() {
		return {
			coupon: this.state.coupon,
			expectedPrice: this.state.currentPrice
		};
	},


	onCouponChanged: function () {
		if (this.props.locked) { return; }
		var couponRef = this.refs.coupon,
			couponEl = couponRef && couponRef.isMounted() && couponRef.getDOMNode(),
			coupon = couponEl && couponEl.value;

		this.setState({
			coupon: coupon,
			checkingCoupon: true
		});

		Actions.updateCoupon(this.props.purchasable, coupon);
	},


	render: function() {
		var type = 'Lifelong Learner - Gift';
		var vendorInfo = this.props.purchasable.VendorInfo;
		var startDate = this.getDate(vendorInfo && vendorInfo.StartDate);
		var endDate = this.getDate(vendorInfo && vendorInfo.EndDate);
		var creditHours= _t('x_creditHours', {count: (vendorInfo && vendorInfo.Hours) || 0});
		var refund = _t('noRefunds');
		var oldTotal = this.state.oldPrice && this.getFormattedPrice(this.state.currency, this.state.oldPrice);
		var total = this.getFormattedPrice(this.state.currency, this.state.currentPrice || 0);
		var discount = this.state.couponDiscount || '';
		var couponLabel = _t('coupon');
		var couponLabelCls = '';

		if (this.props.locked) {
			couponLabelCls = '';
			couponLabel = _t('lockedCoupon');
		} else if (this.state.checkingCoupon) {
			couponLabelCls = 'working';
			couponLabel = _t('checkingCoupon');
		} else if (this.state.triedCoupon) {
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

						<div className="small-6 medium-4 columns">
							<div className="cell">
								<span className="label">{_t("begins")}</span>
								<span className="value">{startDate}</span>
							</div>
							<div className="cell">
								<span className="label">{_t("ends")}</span>
								<span className="value">{endDate}</span>
							</div>
						</div>


						<div className="small-6 medium-4 columns">
							<div className="cell">
								<span className="label">{_t("hours")}</span>
								<span className="value">{creditHours}</span>
							</div>
							<div className="cell">
								<span className="label">{_t("refunds")}</span>
								<span className="value red">{refund}</span>
							</div>
						</div>


						<div className="small-12 medium-4 columns">
							<div className="cell total">
								<span className="label">{_t("total")}</span>
								<span className="value">
									{oldTotal? <span className="old-amount">{oldTotal}</span> : null}
									<span className="amount">{total}</span>
								</span>
							</div>
							<div className="cell coupon">
								<span className={"label " + couponLabelCls}>{couponLabel}</span>
								<input type="text"
									ref="coupon" name="coupon"
									placeholder={_t("couponPlaceholder")}
									readOnly={this.props.locked ? 'readonly' : null}
									onChange={this.onCouponChanged}
									value={this.state.coupon}/>
							</div>
						</div>

					</div>
				</div>
			</div>
		);
	}
});
