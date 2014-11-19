/**
 * @jsx React.DOM
 */

'use strict';

// we're naming fields to line up with the stripe api which uses lowercase
// with underscores (e.g. exp_month vs. expMonth) so don't enforce camel case
// in this file.
/* jshint camelcase:false */

var React = require('react/addons');

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
		var card = this.props.card;

		return (
			<fieldset>
				<div>{card.name}</div>
				<div>{card.address_line1}</div>
				{this._rowIfNotEmpty(card.address_line2)}
				{this._cityStateZipRow(card)}
				<div>**** **** **** {card.last4} ({card.exp_month}/{card.exp_year})</div>
				<a href='../'>edit</a>
			</fieldset>
		);
	}

});

module.exports = BillingInfo;