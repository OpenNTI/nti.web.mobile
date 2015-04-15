
import React from 'react';
import {scoped} from 'common/locale';
let _t = scoped('ENROLLMENT.GIFT.PRICING');
import DateTime from 'common/components/DateTime';

import Store from '../Store';
import Actions from '../Actions';
import Constants from '../Constants';
import FormattedPriceMixin from 'enrollment/mixins/FormattedPriceMixin';

module.exports = React.createClass({
	displayName: 'Pricing',

	mixins: [FormattedPriceMixin],

	propTypes: {
		purchasable: React.PropTypes.object.isRequired
	},

	getInitialState: function() {
		//FIXME: Re-write this:
		// See: http://facebook.github.io/react/tips/props-in-getInitialState-as-anti-pattern.html
		// Additional Node: On Mount and Recieve Props fill state (this is ment to be called one per CLASS lifetime not Instance lifetime)

		let pricing = this.getCouponPricing();
		let state = {
				currency: this.props.purchasable.Currency,
				currentPrice: this.props.purchasable.Amount,
				triedCoupon: false,
				couponDiscount: false,
				checkingCoupon: false
			};

		if (this.props.locked) {
			state.coupon = _t('noCoupon');
		}


		if (pricing && pricing.Coupon) {
			state.coupon = pricing.Coupon.ID;
			state.couponDiscount = this._getDiscountString(pricing.Coupon);
			state.oldPrice = pricing.Amount;
			state.currentPrice = pricing.PurchasePrice;
			state.triedCoupon = true;
		}

		return state;
	},


	componentDidMount: function() {
		Store.addChangeListener(this._onChange);
	},


	componentWillUnmount: function() {
		Store.removeChangeListener(this._onChange);
	},


	getCouponPricing: function() {
		return Store.getCouponPricing();
	},


	_getDiscountString: function(coupon) {
		let discount = '';

		if (coupon.PercentOff) {
			discount = coupon.PercentOff + '%';
		} else if (coupon.AmountOff) {
			discount = this.getFormattedPrice(coupon.Currency, coupon.AmountOff / 100);
		}

		return discount;
	},


	_onChange: function(e) {
		let pricing = e.pricing,
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
		let use = this.state.triedCoupon && this.state.couponDiscount || null;

		return {
			coupon: use && this.state.coupon,
			expectedPrice: this.state.currentPrice
		};
	},


	onCouponChanged: function () {
		if (this.props.locked) {
			return this.setState({ coupon: this.state.coupon });
		}

		let couponRef = this.refs.coupon,
			couponEl = couponRef && couponRef.isMounted() && couponRef.getDOMNode(),
			coupon = couponEl && couponEl.value;

		this.setState({
			coupon: coupon,
			checkingCoupon: true
		});

		Actions.updateCoupon(this.props.purchasable, coupon);
	},


	render: function() {
		let type = 'Lifelong Learner';
		let vendorInfo = this.props.purchasable.VendorInfo;
		let startDate = vendorInfo && vendorInfo.StartDate;
		let endDate = vendorInfo && vendorInfo.EndDate;
		let creditHours = 'No College Credit';//_t('x_creditHours', {count: (vendorInfo && vendorInfo.Hours) || 0});
		let refund = _t('noRefunds');
		let oldTotal = this.state.oldPrice && this.getFormattedPrice(this.state.currency, this.state.oldPrice);
		let total = this.getFormattedPrice(this.state.currency, this.state.currentPrice || 0);
		let discount = this.state.couponDiscount || '';
		let couponLabel = _t('coupon');
		let couponLabelCls = '';

		if (this.props.locked) {
			couponLabelCls = '';
			couponLabel = _t('lockedCoupon');
		} else if (this.state.checkingCoupon) {
			couponLabelCls = 'working';
			couponLabel = _t('checkingCoupon');
		} else if (this.state.triedCoupon) {
			if (this.state.couponDiscount) {
				couponLabelCls = 'valid';
				couponLabel = _t('validCoupon', {discount: discount});
			} else {
				couponLabelCls = 'invalid';
				couponLabel = _t('invalidCoupon');
			}
		}

		return (
			<div className="pricing-info">
				<div className="title">
					<span className="sub">{_t('subType')}</span>
					<span className="main">{type}</span>
				</div>
				<div className="info">
					<div className="row">

						<div className="small-6 medium-4 columns">
							<div className="cell">
								<span className="label">{_t('begins')}</span>
								<DateTime className="value" date={startDate} />
							</div>
							<div className="cell">
								<span className="label">{_t('ends')}</span>
								<DateTime className="value" date={endDate} />
							</div>
						</div>


						<div className="small-6 medium-4 columns">
							<div className="cell">
								<span className="label">{_t('hours')}</span>
								<span className="value">{creditHours}</span>
							</div>
							<div className="cell">
								<span className="label">{_t('refunds')}</span>
								<span className="value red">{refund}</span>
							</div>
						</div>


						<div className="small-12 medium-4 columns">
							<div className="cell total">
								<span className="label">{_t('total')}</span>
								<span className="value">
									{oldTotal? <span className="old-amount">{oldTotal}</span> : null}
									<span className="amount">{total}</span>
								</span>
							</div>
							<div className="cell coupon">
								<span className={'label ' + couponLabelCls}>{couponLabel}</span>
								<input type="text"
									ref="coupon" name="coupon"
									placeholder={_t('couponPlaceholder')}
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
