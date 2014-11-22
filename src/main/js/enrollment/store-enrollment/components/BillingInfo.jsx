/**
 * @jsx React.DOM
 */

'use strict';

// we're naming fields to line up with the stripe api which uses lowercase
// with underscores (e.g. exp_month vs. expMonth) so don't enforce camel case
// in this file.
/* jshint camelcase:false */

var React = require('react/addons');
var _t = require('common/locale').scoped('ENROLLMENT.CONFIRMATION');

function notEmpty(value) {
	return (value||'').trim().length > 0;
}

var BillingInfo = React.createClass({

	_rowIfNotEmpty: function(value) {
		return (value||'').trim().length > 0 ? <div>{value}</div> : null;
	},

	_cityStateZipRow: function(card) {
		var parts = [];
		// if city and state, join with ', '.
		// if city and zip, join with ', '
		var city = card.address_city;
		var state = card.address_state;
		var zip = card.address_zip;

		if (notEmpty(city) && (notEmpty(state) || notEmpty(zip))) {
			city = city.concat(',');
		}
		[city,state,zip].forEach(function(value) {
			if (notEmpty(value)) {
				parts.push(value);
			}
		});
		return this._rowIfNotEmpty(parts.join(' '));
	},

	render: function() {
		var card = this.props.card,
			city = card.address_city ? card.address_city + ',' : '';

		return (
			<div>
				<fieldset>
					<div className="title">
						<span>{_t("paymentInfo")}</span>
						<a href="{this.props.edit}">edit</a>
					</div>
					<div className="field">{card.name}</div>
					<div className="field">
						<span className="label">{card.brand}:</span>
						<span className="value">**** **** **** {card.last4}</span>
					</div>
					<div className="field">
						<span className="label">{_t("expires")}</span>
						<span className="value">{card.exp_month}/{card.exp_year}</span>
					</div>
				</fieldset>
				<fieldset>
					<div className="title">
						<span>{_t("billingInfo")}</span>
						<a href="{this.props.edit}">edit</a>
					</div>
					<div className="field">{card.address_line1}</div>
					<div className="field">{card.address_line2}</div>
					<div className="city field">
						<span>{city}</span>
						<span>{card.address_state}</span>
						<span>{card.address_zip}</span>
					</div>
					<div className="field">{card.address_country}</div>
				</fieldset>
			</div>
		);
	}

});

module.exports = BillingInfo;