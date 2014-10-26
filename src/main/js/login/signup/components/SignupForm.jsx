/**
 * @jsx React.DOM
 */

 'use strict';

var React = require('react/addons');
var t = require('common/locale').scoped('LOGIN.forms.createaccount');

var Store = require('../Store');
var Actions = require('../Actions');
var LoginActions = require('../../Actions');

var Button = require('common/components/forms/Button');
var UserAgreement = require('./UserAgreement');
var Router = require('react-router-component');
var Link = Router.Link;
var Loading = require('common/components/Loading');
var merge = require('react/lib/merge');
var Utils = require('common/Utils');
var NavigatableMixin = Router.NavigatableMixin;

var _preflightDelayMs = 1000; // how long to buffer user input before sending another dataserver preflight request.

var SignupForm = React.createClass({

	mixins: [NavigatableMixin],

	getDefaultProps: function() {
		return {
			privacyUrl: Store.getPrivacyUrl()
		};
	},

	getInitialState: function() {
		return {
			loading: true,
			preflightTimeoutId: null,
			formConfig: {},
			fieldValues: {},
			errors: {}
		};
	},

	_fullname: function() {
		return [this.state.fieldValues['fname'], this.state.fieldValues['lname']].join(' ');
	},

	_handleSubmit: function(evt) {
		evt.preventDefault();
		console.log('create account.');
		var fields = merge(this.state.fieldValues, {realname: this._fullname()});
		Actions.createAccount({
			fields: fields
		});
		return false;
	},

	storeChanged: function(event) {
		console.debug('SignupForm received Store change event: %O', event);
		switch (event.type) {
			case 'error':
				var errs = Utils.indexArrayByKey(Store.getErrors(),'field');

				// realname is a synthetic field; map its error messages to the last name field.
				if (errs['realname'] && !errs['lname']) {
					errs['lname'] = errs['realname'];
				}
				this.setState({
					errors: errs
				});
			break;

			case 'created':
				LoginActions.deleteTOS();
				window.location.replace(this.props.basePath);
			break;
		}
	},

	componentDidMount: function() {
		Store.addChangeListener(this.storeChanged);
		Store.getFormConfig().then(function(value) {
			this.setState({
				loading: false,
				formConfig: value
			})
		}.bind(this));
	},

	componentWillUnmount: function() {
		Store.removeChangeListener(this.storeChanged);
	},

	_inputChanged: function(event) {
		var newState = {};
		newState[event.target.name] = event.target.value;
		newState['realname'] = this._fullname();
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

	_submitEnabled: function() {
		return Object.keys(this.state.errors).length === 0 &&
		this.state.formConfig.fields.every(function(fieldConfig) {
			return !fieldConfig.required || (this.state.fieldValues[fieldConfig.ref]||'').length > 0;
		}.bind(this));
	},

	render: function() {

		if (this.state.loading) {
			return <Loading />;
		}

		var fields = this.state.formConfig.fields.map(function(field,index,arr) {
			var err = this.state.errors[field.ref];
			var cssClass = err ? 'error' : null;
			var error = err ? <small className='error'>{err.message}</small> : null;
			return (<div key={field.ref}><input type={field.type}
						ref={field.ref}
						value={this.state[field.ref]}
						name={field.ref}
						onChange={this._inputChanged}
						placeholder={t(field.ref)}
						className={cssClass}
						defaultValue={this.state.fieldValues[field.ref]} />{error}</div>);
		}.bind(this));

		var enabled = this._submitEnabled();

		return (
			<div className="row">
				<form className="create-account-form medium-6 medium-centered columns" onSubmit={this._handleSubmit}>
					<fieldset>
						<legend>Create Account</legend>
						{fields}
						<div>
							<UserAgreement />
						</div>
						<input type="submit" className="small-12 columns tiny button radius" disabled={!enabled} value="Create Account" />
						<a href={this.props.privacyUrl} target="_blank" className="small-12 columns text-center">Privacy Policy</a>
					</fieldset>
					
				</form>
			</div>
		);
	}

});

module.exports = SignupForm;