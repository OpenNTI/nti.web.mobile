import React from 'react';

import PanelButton from 'common/components/PanelButton';
import PanelNoButton from 'common/components/PanelNoButton';
import Err from 'common/components/Error';

import {scoped} from 'common/locale';

import FormattedPriceMixin from '../../mixins/FormattedPriceMixin';
import BasePathAware from 'common/mixins/BasePath';
import Giftable from './Giftable';
import RedeemButton from './RedeemButton';

const t = scoped('ENROLLMENT');
const getPurchasable = 'StoreEnrollment:getPurchasable';

export default React.createClass({
	displayName: 'StoreEnrollment',

	mixins: [FormattedPriceMixin, BasePathAware],

	propTypes: {
		catalogEntry: React.PropTypes.object.isRequired,
		enrollmentOption: React.PropTypes.object.isRequired,
		entryId: React.PropTypes.string.isRequired,
		isGiftable: React.PropTypes.bool
	},

	statics: {
		re: /storeenrollmentoption/i,
		handles (option) {
			return this.re.test(option && option.MimeType);
		}
	},

	[getPurchasable] (enrollmentOption) {
		return enrollmentOption.getPurchasable();
	},

	render () {

		let purchasable = this[getPurchasable](this.props.enrollmentOption);

		if (!purchasable || !purchasable.currency || !purchasable.amount) {
			return <PanelNoButton><Err error="Pricing information is unavailable." /></PanelNoButton>;
		}

		let formattedPrice = this.getFormattedPrice(purchasable.currency, purchasable.amount);

		let basePath = this.getBasePath();
		let href = basePath + 'catalog/enroll/purchase/' + this.props.entryId + '/';
		let giftHref = basePath + 'catalog/gift/purchase/' + this.props.entryId + '/';

		return (
			<div>
				<div className="store-enrollment">
					<h2 className="title">{t('storeEnrollmentTitle')}</h2>
					<p className="price">{formattedPrice}</p>
					<p className="description">{t('storeEnrollmentGainAccess')}</p>
					<small>{t('enrollmentNotRefundable')}</small>
					<div className="actions">
						<a href={href}>{t('enrollAsLifelongLearner')}</a>
					</div>
				</div>

				{this.props.isGiftable &&
					<div className="gift-options-wrapper">
						<ul className="gift-options">
							<li><Giftable href={giftHref} /></li>
							<li><RedeemButton catalogId={this.props.entryId} /></li>
						</ul>
					</div>
				}
			</div>
		);
	}

});
