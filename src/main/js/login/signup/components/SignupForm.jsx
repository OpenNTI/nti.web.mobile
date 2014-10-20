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
var Utils = require('common/Utils');
var NavigatableMixin = require('common/mixins/NavigatableMixin');

var _preflightDelayMs = 1000; // how long to buffer user input before sending another dataserver preflight request.

var SignupForm = React.createClass({

	mixins: [NavigatableMixin],

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
				console.debug(errs);
				this.setState({
					errors: errs
				});
			break;

			case 'created':
				this.navigate('/');
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
			var err = this.state.errors[field.ref];
			var cssClass = err ? 'error' : null;
			var error = err ? <small className='error'>{err.message}</small> : null;
			return (<div><input type={field.type}
						key={field.ref}
						ref={field.ref}
						value={this.state[field.ref]}
						name={field.ref}
						onChange={this._inputChanged}
						placeholder={t(field.ref)}
						className={cssClass}
						defaultValue={this.state.fieldValues[field.ref]} />{error}</div>);
		}.bind(this));

		return (
			<div className="row">

				<div className="medium-6 medium-centered columns">
					<div className="notice">
						If you are a current student at the University of Oklahoma, you don't need to create an account. <Link href="/">Log in with your OUNet ID (4+4)</Link>
					</div>
				</div>
				<form className="create-account-form medium-6 medium-centered columns" onSubmit={this._handleSubmit}>
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