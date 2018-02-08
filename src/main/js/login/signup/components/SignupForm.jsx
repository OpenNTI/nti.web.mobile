import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import createReactClass from 'create-react-class';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import {Mixins} from 'nti-web-commons';
import {StoreEventsMixin} from 'nti-lib-store';
import {scoped} from 'nti-lib-locale';
import {getServer, getReturnURL} from 'nti-web-client';

import UserAgreement from 'login/prompts/terms/components/UserAgreement';

import Store from '../Store';
import {ERROR_EVENT} from '../Constants';
import {clearErrors, preflightAndCreateAccount} from '../Actions';

const t = scoped('app.login.CREATE_ACCOUNT');

const indexArrayByKey = (array, key) => array.reduce((a, i) => (a[i[key]] = i, a), {});

const FIELDS = [
	{name: 'fname', type: 'text', required: true},
	{name: 'lname', type: 'text', required: true},
	{name: 'email', type: 'email', required: true},
	{name: 'Username', type: 'text', required: true},
	{name: 'password', type: 'password', required: true},
	{name: 'password2', type: 'password', required: true}
];


export default createReactClass({
	displayName: 'SignupForm',
	mixins: [StoreEventsMixin, Mixins.NavigatableMixin, Mixins.BasePath],

	propTypes: {
		privacyUrl: PropTypes.string
	},

	backingStore: Store,
	backingStoreEventHandlers: {
		default: 'storeChanged'
	},


	attachRef (el) { this.form = el; },


	getDefaultProps () {
		return {
			privacyUrl: Store.getPrivacyUrl()
		};
	},


	getInitialState () {
		return {
			errors: {}
		};
	},


	getFields () {
		return (this.form || {}).elements;
	},


	getFullName () {
		let {fname = {}, lname = {}} = this.getFields() || {};
		return [fname.value, lname.value].join(' ');
	},


	handleSubmit (evt) {
		evt.preventDefault();

		if(Object.keys(this.state.errors).length > 0) {
			return;
		}

		let fields = this.getFields();

		fields = FIELDS.reduce(
			(o, x) => {
				o[x.name] = fields[x.name].value;
				return o;
			},
			{realname: this.getFullName()});

		this.setState({ busy: true });

		clearErrors();
		preflightAndCreateAccount({fields});
		return false;
	},

	storeChanged (event) {
		let errors;
		if (event.type === 'created') {
			const returnPath = getReturnURL();
			const path = returnPath || this.getBasePath();
			getServer().deleteTOS()
				.then(() => { window.location.replace(path); });
			return;
		}

		let enabled = this.isSubmitEnabled();

		if (event.type === ERROR_EVENT) {
			enabled = false;
			errors = indexArrayByKey(Store.getErrors(), 'field');
			// realname is a synthetic field; map its error messages to the last name field.
			// if (errors['realname'] && !errors['lname']) {
			// 	errs['lname'] = errs['realname'];
			// }
		}

		this.setState({enabled, busy: false, errors});
	},


	onBlur (e) {
		let {state = {}} = this;
		let {errors = {}} = state;

		let {name} = (e || {}).target || {};
		if (name in errors) {
			errors = Object.assign({}, errors);
			delete errors[name];
			return this.setState({errors}, () => setTimeout(()=> this.onBlur(e), 100));
		}
		//map fname & lname to realname. (so we can clear errors)
		else if (name in {fname: 1, lname: 1}) {
			return this.onBlur({target: {name: 'realname'}});
		}

		let enabled = this.isSubmitEnabled();
		if (enabled !== state.enabled) {
			this.setState({enabled});
		}
	},

	onChange (e) {
		this.onBlur(e);
	},

	isSubmitEnabled () {
		let {busy, errors} = this.state;

		return !busy && Object.keys(errors).length === 0
			&& this.requiredFieldsFilled();
	},


	requiredFieldsFilled () {
		let fields = this.getFields();
		if (!fields) {
			return false;
		}

		return FIELDS.every(x => !x.required || fields[x.name].value);
	},


	render () {
		const {enabled, errors} = this.state;

		return (
			<div className="row">
				<form ref={this.attachRef}
					className="create-account-form medium-6 medium-centered columns"
					autoComplete="off"
					onSubmit={this.handleSubmit}
				>

					<fieldset>
						<legend>Create Account</legend>

						{FIELDS.map( field =>

							(<div key={field.name}>
								<input name={field.name} placeholder={t(field.name)} type={field.type}
									className={cx({required: field.required})} required={field.required}
									onChange={this.onChange} onBlur={this.onBlur}/>
							</div>)

						)}

					</fieldset>


					<UserAgreement />

					<div className="errors">
						<TransitionGroup>
							{Object.keys(errors).map(ref => (
								<CSSTransition key={ref} classNames="fade-out-in" timeout={500}>
									<small className="error">{errors[ref].message}</small>
								</CSSTransition>
							))}
						</TransitionGroup>
					</div>

					<input type="submit"
						id="signup:submit"
						className="small-12 columns tiny button"
						disabled={!enabled}
						value="Create Account" />

					<a id="signup:privacy:policy"
						href={this.props.privacyUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="small-12 columns text-center"
					>
						Privacy Policy
					</a>
				</form>
			</div>
		);
	}

});
