import React from 'react';

import Notice from 'common/components/Notice';
import Err from 'common/components/Error';

import {scoped} from 'common/locale';

import FormattedPriceMixin from '../../mixins/FormattedPriceMixin';
import BasePathAware from 'common/mixins/BasePath';
import GiftOptions from './GiftOptions';

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
			return <Notice><Err error="Pricing information is unavailable." /></Notice>;
		}

		let formattedPrice = this.getFormattedPrice(purchasable.currency, purchasable.amount);

		let basePath = this.getBasePath();
		let href = basePath + 'catalog/enroll/purchase/' + this.props.entryId + '/';

		return (
			<div>
				<div className="enrollment store-enrollment">
					<h2 className="title">{t('storeEnrollmentTitle')}</h2>
					<p className="price">{formattedPrice}</p>
					<p className="description">{t('storeEnrollmentGainAccess')}</p>
					<small>{t('enrollmentNotRefundable')}</small>
					<div className="actions">
						<a href={href}>{t('enrollAsLifelongLearner')}</a>
					</div>
				</div>

				{this.props.isGiftable &&
					<GiftOptions catalogEntry={this.props.catalogEntry} />
				}
			</div>
		);
	}

});
