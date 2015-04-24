import React from 'react';

import PanelButton from 'common/components/PanelButton';

import {scoped} from 'common/locale';

import FormattedPriceMixin from '../../mixins/FormattedPriceMixin';

import Giftable from './Giftable';

const t = scoped('ENROLLMENT');

export default React.createClass({
	displayName: 'StoreEnrollment',

	mixins: [FormattedPriceMixin],

	propTypes: {
		catalogEntry: React.PropTypes.object.isRequired,
		enrollmentOption: React.PropTypes.object.isRequired,
		isGiftable: React.PropTypes.bool
	},

	statics: {
		re: /StoreEnrollment/i,
		handles (options) {
			return this.re.test(options && options.key);
		}
	},

	render () {

		let option = this.props.enrollmentOption.option;
		let formattedPrice = this.getFormattedPrice(option.Currency, option.Price);

		return (
			<PanelButton href="store/" linkText={t('enrollAsLifelongLearner')}>
				<h2>{t('storeEnrollmentTitle')}</h2>
				<p>Gain complete access to interact with all course content,
				including lectures, course materials, quizzes,
				and discussions once the class is in session.</p>
				<p className="price">{formattedPrice}</p>
				{this.props.isGiftable ? <Giftable href='store/gift/' /> : null }
				<small>{t('enrollmentNotRefundable')}</small>
			</PanelButton>
		);
	}

});
