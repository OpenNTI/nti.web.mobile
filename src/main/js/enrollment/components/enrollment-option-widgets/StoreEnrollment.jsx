import React from 'react';

import PanelButton from 'common/components/PanelButton';
import PanelNoButton from 'common/components/PanelNoButton';
import Err from 'common/components/Error';

import {scoped} from 'common/locale';

import FormattedPriceMixin from '../../mixins/FormattedPriceMixin';
import BasePathAware from 'common/mixins/BasePath';
import Giftable from './Giftable';

const t = scoped('ENROLLMENT');
const getPurchasable = 'StoreEnrollment:getPurchasable';

export default React.createClass({
	displayName: 'StoreEnrollment',

	mixins: [FormattedPriceMixin, BasePathAware],

	propTypes: {
		catalogEntry: React.PropTypes.object.isRequired,
		enrollmentOption: React.PropTypes.object.isRequired,
		isGiftable: React.PropTypes.bool
	},

	statics: {
		re: /storeenrollmentoption/i,
		handles (option) {
			return this.re.test(option && option.MimeType);
		}
	},

	[getPurchasable](enrollmentOption) {
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
				<p>Gain complete access to interact with all course content,
				including lectures, course materials, quizzes,
				and discussions once the class is in session.</p>
				<p className="price">{formattedPrice}</p>
				{this.props.isGiftable ? <Giftable href={giftHref} /> : null }
				<small>{t('enrollmentNotRefundable')}</small>
			</PanelButton>
		);
	}

});
