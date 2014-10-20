/**
 * @jsx React.DOM
 */

 'use strict';

var React = require('react/addons');
var t = require('common/locale').scoped('LOGIN.forms.createaccount');

var Store = require('../Store');
var Actions = require('../Actions');

var Button = require('common/components/forms/Button');
var UserAgreement = require('./UserAgreement');
var Router = require('react-router-component');
var Link = Router.Link;
var Loading = require('common/components/Loading');
var merge = require('react/lib/merge');

var _preflightDelayMs = 1000; // how long to buffer user input before sending another dataserver preflight request.

var SignupForm = React.createClass({

	getInitialState: function() {
		return {
			loading: true,
			preflightTimeoutId: null,
			formConfig: {},
			fieldValues: {}
		};
	},

	_handleSubmit: function() {
		console.log('create account.');
		Actions.createAccount({fields: this.state.fieldValues});
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

	_inputChanged: function(event) {
		var newState = {};
		newState[event.target.name] = event.target.value;
		var tmp = merge(this.state.fieldValues, newState);
		this.setState({
			fieldValues: tmp
		});

		clearTimeout(this.state.preflightTimeoutId);
		var timeoutId = global.setTimeout(function() {
			Actions.preflight({
				fields: tmp
			});
		}.bind(this),_preflightDelayMs);
		this.setState({preflightTimeoutId: timeoutId});
	},

	render: function() {

		if (this.state.loading) {
			return <Loading />;
		}

		var fields = this.state.formConfig.fields.map(function(field,index,arr) {
			return (<input type={field.type}
						key={field.ref}
						ref={field.ref}
						value={this.state[field.ref]}
						name={field.ref}
						onChange={this._inputChanged}
						placeholder={t(field.ref)}
						defaultValue={this.state.fieldValues[field.ref]} />);
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
						<input type="submit" className="tiny button radius" value="Create Account" />
					</fieldset>
					<a href="">Privacy Policy</a>
				</form>
			</div>
		);
	}

});

module.exports = SignupForm;