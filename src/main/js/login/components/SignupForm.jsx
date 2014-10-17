/**
 * @jsx React.DOM
 */

 'use strict';

var React = require('react/addons');
var t = require('common/locale').scoped('LOGIN.forms.createaccount');

var Button = require('common/components/forms/Button');
var UserAgreement = require('./UserAgreement');
var Router = require('react-router-component');
var Link = Router.Link;

var formFields = [
	{
		ref: 'fname',
		type: 'text'
	}, 
	{
		ref: 'lname',
		type: 'text'
	}, 
	{
		ref: 'email',
		type: 'email'
	}, 
	{
		ref: 'username',
		type: 'text'
	}, 
	{
		ref: 'password',
		type: 'password'
	}, 
	{
		ref: 'password2',
		type: 'password'
	}
];

var SignupForm = React.createClass({

	getInitialState: function() {
		return {};
	},

	_handleSubmit: function() {

	},

	render: function() {

		var fields = formFields.map(function(field,index,arr) {
			return (<input type={field.type}
						ref={field.ref}
						placeholder={t(field.ref)}
						defaultValue={this.state[field.ref]} />);
		}.bind(this));

		return (
			<div className="row">
				<div className="medium-6 medium-centered columns">
					<div className="notice">
						If you are a current student at the University of Oklahoma, you don't need to create an account. <Link href="/">Log in with your OUNet ID (4+4)</Link>
					</div>
				</div>
				<form className="create-account-form medium-6 medium-centered columns" onSubmit={this._handleSubmit} noValidate>
					<fieldset>
						{fields}
						<div>
							<UserAgreement />
						</div>
						<Button>Create Account</Button>
					</fieldset>
					<a href="">Privacy Policy</a>
				</form>
			</div>
		);
	}

});

module.exports = SignupForm;