/**
 * @jsx React.DOM
 */

 'use strict';

var React = require('react/addons');
var t = require('common/locale').scoped('LOGIN.forms.createaccount');

var Store = require('../Store');

var Button = require('common/components/forms/Button');
var UserAgreement = require('./UserAgreement');
var Router = require('react-router-component');
var Link = Router.Link;
var Loading = require('common/components/Loading');

var SignupForm = React.createClass({

	getInitialState: function() {
		return {
			loading: true,
			formConfig: {}
		};
	},

	_handleSubmit: function() {
		console.log('create account.');
		return false;
	},

	componentDidMount: function() {
		Store.getFormConfig().then(function(value) {
			this.setState({
				loading: false,
				formConfig: value
			})
		}.bind(this));
	},

	render: function() {

		if (this.state.loading) {
			return <Loading />
		}

		var fields = this.state.formConfig.fields.map(function(field,index,arr) {
			return (<input type={field.type}
						ref={field.ref}
						placeholder={t(field.ref)}
						defaultValue={this.state[field.ref]} />);
		}.bind(this));

		console.log('{this.state.formConfig.links}, %O', this.state.formConfig);

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
						<input type="submit" value="Create Account" />
					</fieldset>
					<a href="">Privacy Policy</a>
				</form>
			</div>
		);
	}

});

module.exports = SignupForm;