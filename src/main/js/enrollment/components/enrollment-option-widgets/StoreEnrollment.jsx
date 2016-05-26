import React from 'react';

import {Notice} from 'nti-web-commons';
import {Error as Err} from 'nti-web-commons';

import {scoped} from 'nti-lib-locale';

import FormattedPriceMixin from '../../mixins/FormattedPriceMixin';
import {Mixins} from 'nti-web-commons';
import GiftOptions from './GiftOptions';

const t = scoped('ENROLLMENT');
const getPurchasable = 'StoreEnrollment:getPurchasable';

export default React.createClass({
	displayName: 'StoreEnrollment',

	mixins: [FormattedPriceMixin, Mixins.BasePath],

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

		const {enrollmentOption: {enrolled}} = this.props;

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
					{enrolled
						?
						(<div className="enrollment-status">
							<div className="status">
								<span className="registered">You are registered</span>
							</div>
						</div>)
						:
						(<div className="actions">
							<a href={href}>{t('enrollAsLifelongLearner')}</a>
						</div>)
					}

				</div>

				{this.props.isGiftable &&
					<GiftOptions catalogEntry={this.props.catalogEntry} />
				}
			</div>
		);
	}

});
