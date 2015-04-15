

module.exports = Object.freeze([
	{
		title: 'Billing Info',
		fields: [
			{
				ref: 'name',
				type: 'text',
				required: true,
				placeholder: 'Name on card'
			},
			{
				ref: 'number', // this is the name expected by the stripe api and returned by Stripe.getToken().
				type: 'number',
				placeholder: '1234 1234 1234 1234',
				required: true
			},
			{
				ref: 'exp_month', // this is the name expected by the stripe api and returned by Stripe.getToken().
				type: 'number',
				placeholder: 'MM',
				required: true
			},
			{
				ref: 'exp_year', // this is the name expected by the stripe api and returned by Stripe.getToken().
				type: 'number',
				placeholder: 'YY',
				required: true
			},
			{
				ref: 'cvc', // this is the name expected by the stripe api and returned by Stripe.getToken().
				type: 'number',
				placeholder: 'CVC',
				required: true
			},
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
