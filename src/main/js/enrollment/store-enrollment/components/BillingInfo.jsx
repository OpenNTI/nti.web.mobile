// we're naming fields to line up with the stripe api which uses lowercase
// with underscores (e.g. exp_month vs. expMonth) so don't enforce camel case
// in this file.

import React from 'react';
import {edit} from '../Actions';
import {scoped} from 'common/locale';
let t = scoped('ENROLLMENT.CONFIRMATION');

const rowIfNotEmpty = 'BillingInfo:rowIfNotEmpty';

export default React.createClass({
	displayName: 'BillingInfo',

	propTypes: {
		edit: React.PropTypes.any,
		card: React.PropTypes.object
	},

	[rowIfNotEmpty] (value) {
		return (value || '').trim().length > 0 ? <div>{value}</div> : null;
	},

	onEdit (e) {
		e.preventDefault();
		e.stopPropagation();
		edit(this.props.edit);
	},

	render () {
		let card = this.props.card,
			city = card.address_city ? card.address_city + ',' : '';

		return (
			<div>
				<fieldset>
					<div className="title">
						<span>{t('paymentInfo')}</span>
						<span> </span>
						<a href="#" onClick={this.onEdit}>edit</a>
					</div>

					<div className="field">{card.name}</div>
					<div className="field">
						<span className="label">{card.brand}:</span>
						<span> </span>
						<span className="value">**** **** **** {card.last4}</span>
					</div>
					<div className="field">
						<span className="label">{t('expires')}</span>
						<span> </span>
						<span className="value">{card.exp_month}/{card.exp_year}</span>
					</div>
				</fieldset>
				<fieldset>
					<div className="title">
						<span>{t('billingInfo')}</span> <a href="#" onClick={this.onEdit}>edit</a>
					</div>

					<div className="field">{card.address_line1}</div>
					<div className="field">{card.address_line2}</div>
					<div className="city field">
						<span>{city}</span>
						<span> </span>
						<span>{card.address_state}</span>
						<span> </span>
						<span>{card.address_zip}</span>
					</div>
					<div className="field">{card.address_country}</div>
				</fieldset>
			</div>
		);
	}

});
