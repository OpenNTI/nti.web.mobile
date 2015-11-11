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
			<PanelButton href={href} linkText={t('enrollAsLifelongLearner')}>
				<h2>{t('storeEnrollmentTitle')}</h2>
				<p>{t('storeEnrollmentGainAccess')}</p>
				<p className="price">{formattedPrice}</p>
				<small>{t('enrollmentNotRefundable')}</small>
				{this.props.isGiftable &&
					<ul className="small-block-grid-2">
						<li><Giftable href={giftHref} className="columns"/></li>
						<li><RedeemButton catalogId={this.props.entryId} className="columns"/></li>
					</ul>
				}
			</PanelButton>
		);
	}

});
