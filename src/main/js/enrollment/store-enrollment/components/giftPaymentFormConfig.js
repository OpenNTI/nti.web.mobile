'use strict';

module.exports = Object.freeze([
	{
		fields: [
			{
				ref: 'from',
				type: 'email',
				required: true,
				placeholder: 'Email Address'
			}
		]
	},
	{
		title: 'Credit Card Information',
		fields: [
			{
				ref: 'name',
				type: 'text',
				required: true,
				placeholder: 'Name on card'
			},
			{
				ref: 'number', // this is the name expected by the stripe api and returned by Stripe.getToken().
				placeholder: '1234 1234 1234 1234',
				type: 'number',
				required: true
			},
			{
				ref: 'exp_', // this is the name expected by the stripe api and returned by Stripe.getToken().
				placeholder: 'MM / YY',
				type: 'number',
				required: true
			},
			{
				ref: 'cvc', // this is the name expected by the stripe api and returned by Stripe.getToken().
				placeholder: 'CVC',
				type: 'number',
				required: true
			}
		]
	},
	{
		title: 'Billing Info',
		fields: [
			{
				ref: 'address_line1', // this is the name expected by the stripe api and returned by Stripe.getToken().
				type: 'text',
				required: true,
				placeholder: 'Address'
			},
			{
				ref: 'address_line2', // this is the name expected by the stripe api and returned by Stripe.getToken().
				type: 'text',
				required: false,
				placeholder: 'Address (optional)'
			 },
			 {
				ref: 'address_city', // this is the name expected by the stripe api and returned by Stripe.getToken().
				type: 'text',
				placeholder: 'City'
			 },
			 {
				ref: 'address_state', // this is the name expected by the stripe api and returned by Stripe.getToken().
				type: 'text',
				placeholder: 'State/Province/Territory/Region'
			 },
			 {
				ref: 'address_country', // this is the name expected by the stripe api and returned by Stripe.getToken().
				type: 'text',
				required: true,
				placeholder: 'Country'
			 },
			 {
			 	ref: 'address_zip', // this is the name expected by the stripe api and returned by Stripe.getToken().
			 	type: 'text',
			 	placeholder: 'Zip/Postal Code'
			 }
		]
	}
]);