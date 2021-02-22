import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { scoped } from '@nti/lib-locale';
import { DateTime } from '@nti/web-commons';

import FormattedPriceMixin from 'enrollment/mixins/FormattedPriceMixin';

import Store from '../Store';
import { updateCoupon } from '../Actions';
import * as Constants from '../Constants';

const t = scoped('enrollment.gift.pricing', {
	begins: 'Course Begins',
	checkingCoupon: 'Checking Coupon',
	coupon: 'I have a coupon',
	couponPlaceholder: 'Coupon Code',
	ends: 'Course Ends',
	hours: 'Credit Hours',
	invalidCoupon: 'Invalid Coupon',
	lockedCoupon: 'Coupon',
	noCoupon: 'No Coupon',
	noRefunds: 'Not Refundable',
	refunds: 'Refunds',
	subType: 'Enrollment Type',
	total: 'total',
	validCoupon: 'Coupon Accepted: %(discount)s off',
	x_creditHours: {
		one: '%(count)s Credit Hour',
		other: '%(count)s Credit Hours',
	},
});

const getDiscountString = 'Pricing:getDiscountString';
const onChange = 'Pricing:onChange';

export default createReactClass({
	displayName: 'Pricing',

	mixins: [FormattedPriceMixin],

	propTypes: {
		purchasable: PropTypes.object.isRequired,
		locked: PropTypes.bool,
	},

	attachCouponRef(x) {
		this.coupon = x;
	},

	getInitialState() {
		const { props } = this;
		const pricing = this.getCouponPricing();
		const state = {
			currency: props.purchasable.currency,
			currentPrice: props.purchasable.amount,
			triedCoupon: false,
			couponDiscount: false,
			checkingCoupon: false,
		};

		if (props.locked) {
			state.coupon = t('noCoupon');
		}

		if (pricing && pricing.coupon) {
			state.coupon = pricing.coupon.getCode();
			state.couponDiscount = this[getDiscountString](pricing.coupon);
			state.oldPrice = pricing.amount;
			state.currentPrice = pricing.price;
			state.triedCoupon = true;
		}

		return state;
	},

	componentDidUpdate(prevProps) {
		if (this.props.purchasable !== prevProps.purchasable) {
			this.resetState();
		}
	},

	resetState() {
		this.setState(this.getInitialState());
	},

	componentDidMount() {
		Store.addChangeListener(this[onChange]);
	},

	componentWillUnmount() {
		Store.removeChangeListener(this[onChange]);
	},

	getCouponPricing() {
		return Store.getCouponPricing();
	},

	[getDiscountString](coupon) {
		let discount = '';

		if (coupon.percentOff) {
			discount = coupon.percentOff + '%';
		} else if (coupon.amountOff) {
			discount = this.getFormattedPrice(
				coupon.currency,
				coupon.amountOff / 100
			);
		}

		return discount;
	},

	[onChange](e) {
		let { pricing } = e;
		let discount;

		if (this.props.locked) {
			return;
		}

		if (e.type === Constants.VALID_COUPON) {
			discount = this[getDiscountString](pricing.coupon);

			this.setState({
				currentPrice: pricing.price,
				oldPrice: pricing.amount,
				triedCoupon: true,
				couponDiscount: discount,
				checkingCoupon: false,
			});
		} else if (e.type === Constants.INVALID_COUPON) {
			if (e.coupon === '') {
				this.setState({
					triedCoupon: false,
					couponDiscount: '',
					oldPrice: null,
					currentPrice: this.props.purchasable.amount,
					checkingCoupon: false,
				});
			} else {
				this.setState({
					triedCoupon: true,
					couponDiscount: '',
					oldPrice: null,
					currentPrice: this.props.purchasable.amount,
					checkingCoupon: false,
				});
			}
		}
	},

	getData() {
		let use = (this.state.triedCoupon && this.state.couponDiscount) || null;

		return {
			coupon: use && this.state.coupon,
			expectedPrice: this.state.currentPrice,
		};
	},

	onCouponChanged() {
		if (this.props.locked) {
			return this.setState({ coupon: this.state.coupon });
		}

		let coupon = (this.coupon || {}).value;

		this.setState({
			coupon: coupon,
			checkingCoupon: true,
		});

		updateCoupon(this.props.purchasable, coupon);
	},

	render() {
		const {
			props: { locked, purchasable },
		} = this;

		const type = 'One-Time Purchase';
		const { vendorInfo } = purchasable;
		const startDate = vendorInfo && vendorInfo.getStartDate();
		const endDate = vendorInfo && vendorInfo.getEndDate();
		// const creditHours = 'No College Credit';//t('x_creditHours', {count: (vendorInfo && vendorInfo.Hours) || 0});

		const oldTotal =
			this.state.oldPrice &&
			this.getFormattedPrice(this.state.currency, this.state.oldPrice);
		const total = this.getFormattedPrice(
			this.state.currency,
			this.state.currentPrice || 0
		);
		const discount = this.state.couponDiscount || '';
		let couponLabel = t('coupon');
		let couponLabelCls = '';

		if (locked) {
			couponLabelCls = '';
			couponLabel = t('lockedCoupon');
		} else if (this.state.checkingCoupon) {
			couponLabelCls = 'working';
			couponLabel = t('checkingCoupon');
		} else if (this.state.triedCoupon) {
			if (this.state.couponDiscount) {
				couponLabelCls = 'valid';
				couponLabel = t('validCoupon', { discount: discount });
			} else {
				couponLabelCls = 'invalid';
				couponLabel = t('invalidCoupon');
			}
		}

		return (
			<div className="pricing-info row">
				<div className="title">
					<span className="sub">{t('subType')}</span>
					<span className="main">{type}</span>
				</div>
				<div className="info">
					<div className="row">
						<div className="dates small-6 medium-4 columns">
							{startDate && (
								<div className="cell">
									<span className="label">{t('begins')}</span>
									<DateTime
										className="value"
										date={startDate}
									/>
								</div>
							)}
							{endDate && (
								<div className="cell">
									<span className="label">{t('ends')}</span>
									<DateTime
										className="value"
										date={endDate}
									/>
								</div>
							)}
						</div>

						{/*<div className="credits-and-refunds small-6 medium-4 columns">
							<div className="credits cell">
								<span className="label">{t('hours')}</span>
								<span className="value">{creditHours}</span>
							</div>
						</div>*/}

						<div className="price-and-coupon small-12 medium-4 columns">
							<div className="cell total">
								<span className="label">{t('total')}</span>
								<span className="value">
									{oldTotal ? (
										<span className="old-amount">
											{oldTotal}
										</span>
									) : null}
									<span className="amount">{total}</span>
								</span>
							</div>
							<div className="cell coupon">
								<span className={'label ' + couponLabelCls}>
									{couponLabel}
								</span>
								<input
									type="text"
									ref={this.attachCouponRef}
									name="coupon"
									disabled={locked}
									readOnly={locked}
									placeholder={t('couponPlaceholder')}
									onChange={this.onCouponChanged}
									value={this.state.coupon}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	},
});
