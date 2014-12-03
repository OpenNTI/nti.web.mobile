/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var t = require('common/locale').scoped('LOGIN.forms.createaccount');

var Loading = require('common/components/Loading');
var UserAgreement = require('./UserAgreement');

var Router = require('react-router-component');
var NavigatableMixin = Router.NavigatableMixin;
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
var ERROR_EVENT = require('common/constants/Events').ERROR_EVENT;

var indexArrayByKey = require('dataserverinterface/utils/array-index-by-key');

var Store = require('../Store');
var Actions = require('../Actions');
var LoginActions = require('../../Actions');
var LoginStore = require('../../Store');

var RenderFormConfigMixin = require('common/forms/mixins/RenderFormConfigMixin');

var SignupForm = React.createClass({

	mixins: [NavigatableMixin, RenderFormConfigMixin],


	getDefaultProps: function() {
		return {
			privacyUrl: Store.getPrivacyUrl()
		};
	},


	getInitialState: function() {
		return {
			loading: true,
			preflightTimeoutId: null,
			formConfig: [],
			fieldValues: {},
			errors: {}
		};
	},

	_fullname: function(tmpValues) {
		var values = tmpValues || this.state.fieldValues;
		return [values.fname, values.lname].join(' ');
	},


	_handleSubmit: function(evt) {
		evt.preventDefault();
		if(Object.keys(this.state.errors).length > 0) {
			return;
		}
		console.log('create account.');
		var fields = Object.assign(this.state.fieldValues, {realname: this._fullname()});

		this.setState({ busy: true });

		Actions.clearErrors();
		Actions.preflightAndCreateAccount({
			fields: fields
		});
		return false;
	},

	storeChanged: function(event) {
		var errs;
		console.debug('SignupForm received Store change event: %O', event);
		if (event.type === 'created') {
			LoginActions.deleteTOS();
			var returnPath = LoginStore.getReturnPath();
			var path = this.props.basePath.concat(returnPath ? '?return='.concat(returnPath) : '');
			window.location.replace(path);
			return;
		}

		if (event.type === ERROR_EVENT) {
			errs = indexArrayByKey(Store.getErrors(),'field');
			// realname is a synthetic field; map its error messages to the last name field.
			// if (errs['realname'] && !errs['lname']) {
			// 	errs['lname'] = errs['realname'];
			// }
		}

		this.setState({busy: false, errors: errs});
	},


	componentDidMount: function() {
		Store.addChangeListener(this.storeChanged);
		Store.getFormConfig().then(function(value) {
			this.setState({
				loading: false,
				formConfig: value
			});
		}.bind(this));
	},


	componentWillUnmount: function() {
		Store.removeChangeListener(this.storeChanged);
	},

	_inputBlurred: function(event) {
		var target = event.target;
		var field = target.name;
		var value = target.value;
		var tmp = Object.assign({}, this.state.fieldValues);

		if (!value && !tmp.hasOwnProperty(field)) {
			return;
		}

		tmp[field] = value;


		if (tmp.hasOwnProperty('fname') && tmp.hasOwnProperty('lname')) {
			tmp.realname = this._fullname(tmp);
		}

		this.setState({ fieldValues: tmp });

		// Actions.preflight({
		// 	fields: tmp
		// });
	},

	_inputChanged: function(event) {
		this._inputBlurred(event); // we're not preflighting on blur anymore so update the submit button state on every change.
	},

	isSubmitEnabled: function() {
		var state = this.state;
		return !state.busy && Object.keys(state.errors).length === 0 &&
				this._requiredFieldsFilled();
	},

	_requiredFieldsFilled: function() {
		var values = this.state.fieldValues;
		return this.state.formConfig.every(function(fieldset) {
			return fieldset.fields.every(function(field) {
				return !field.required || (values[field.ref]||'').length > 0;
			});
		});
	},

	render: function() {
		var state = this.state;
		var enabled = this.isSubmitEnabled();

		if (state.loading) {
			return <Loading />;
		}

		var fields = this.renderFormConfig(state.formConfig, state.fieldValues, t);

		return (
			<div className="row">
				<form autoComplete="off" className="create-account-form medium-6 medium-centered columns" onSubmit={this._handleSubmit}>
					{fields}
					<UserAgreement />
					<div className='errors'>
							<ReactCSSTransitionGroup transitionName="messages">
								{Object.keys(state.errors).map(
									function(ref) {
										var err = state.errors[ref];
										console.debug(err);
										return (<small key={ref} className='error'>{err.message}</small>);
								})}
							</ReactCSSTransitionGroup>
						</div>
					<input type="submit"
							id="signup:submit"
							className="small-12 columns tiny button radius"
							disabled={!enabled}
							value="Create Account" />
						<a id="signup:privacy:policy"
							href={this.props.privacyUrl}
							target="_blank"
							className="small-12 columns text-center">Privacy Policy</a>
				</form>
			</div>
		);
	}

});

module.exports = SignupForm;
