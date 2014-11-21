'use strict';

module.exports = Object.freeze(
	[{
		title: 'Create Account',
		fields: [
			{
				ref: 'fname',
				type: 'text',
				required: true
			},
			{
				ref: 'lname',
				type: 'text',
				required: true
			},
			{
				ref: 'email',
				type: 'email',
				required: true
			},
			{
				ref: 'Username',
				type: 'text',
				required: true
			},
			{
				ref: 'password',
				type: 'password',
				required: true
			},
			{
				ref: 'password2',
				type: 'password',
				required: true
			}
		]
	}
]);
