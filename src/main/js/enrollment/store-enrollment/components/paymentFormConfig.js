'use strict';

module.exports = Object.freeze([
	{
		ref: 'name',
		type: 'text',
		required: true,
		placeholder: 'Name on card'
	},
	{
		ref: 'number', // this is the name expected by the stripe api.
		placeholder: '1234 1234 1234 1234',
		required: true
	},
	{
		ref: 'exp_month', // this is the name expected by the stripe api.
		placeholder: 'MM',
		required: true
	},
	{
		ref: 'exp_year', // this is the name expected by the stripe api.
		placeholder: 'YY',
		required: true
	},
	{
		ref: 'cvc', // this is the name expected by the stripe api.
		placeholder: 'CVC',
		required: true
	},
	{
		ref: 'address',
		type: 'text',
		required: true,
		placeholder: 'Address'
	},
	{
		ref: 'address2',
		type: 'text',
		required: false,
		placeholder: 'Address (optional)'
	 },
	 {
		ref: 'city',
		type: 'text',
		required: true,
		placeholder: 'City'
	 },
	 {
		ref: 'state',
		type: 'text',
		required: true,
		placeholder: 'State/Province/Territory/Region'
	 },
	 {
		ref: 'country',
		type: 'text',
		required: true,
		placeholder: 'Country'
	 },
	 {
	 	ref: 'zip',
	 	type: 'text',
	 	required: true,
	 	placeholder: 'Zip/Postal Code'
	 }
]);
