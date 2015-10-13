import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import cx from 'classnames';

import {NavigatableMixin} from 'react-router-component';

import {scoped} from 'common/locale';
let t = scoped('LOGIN.CREATE_ACCOUNT');

import {ERROR_EVENT} from 'common/constants/Events';

import {getServer, getReturnURL} from 'common/utils';

import indexArrayByKey from 'nti.lib.interfaces/utils/array-index-by-key';

import UserAgreement from 'terms/components/UserAgreement';

import Store from '../Store';
import Actions from '../Actions';


const FIELDS = [
	{name: 'fname', type: 'text', required: true},
	{name: 'lname', type: 'text', required: true},
	{name: 'email', type: 'email', required: true},
	{name: 'Username', type: 'text', required: true},
	{name: 'password', type: 'password', required: true},
	{name: 'password2', type: 'password', required: true}
];


export default React.createClass({

	displayName: 'SignupForm',

	mixins: [NavigatableMixin],

	propTypes: {
		privacyUrl: React.PropTypes.string,
		basePath: React.PropTypes.string
	},

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
		return (this.refs.form || {}).elements;
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

		Actions.clearErrors();
		Actions.preflightAndCreateAccount({fields});
		return false;
	},

	storeChanged (event) {
		let errors;
		console.debug('SignupForm received Store change event: %O', event);
		if (event.type === 'created') {
			getServer().deleteTOS();
			let returnPath = getReturnURL();
			let path = returnPath || this.props.basePath;
			window.location.replace(path);
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


	componentDidMount () {
		Store.addChangeListener(this.storeChanged);
	},


	componentWillUnmount () {
		Store.removeChangeListener(this.storeChanged);
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
		let {enabled, errors} = this.state;

		return (
			<div className="row">
				<form ref="form" autoComplete="off" className="create-account-form medium-6 medium-centered columns" onSubmit={this.handleSubmit}>

					<fieldset>
						<legend>Create Account</legend>

						{FIELDS.map( field =>

							<div key={field.name}>
								<input name={field.name} placeholder={t(field.name)} type={field.type}
									className={cx({required: field.required})} required={field.required}
									onChange={this.onChange} onBlur={this.onBlur}/>
							</div>

						)}

					</fieldset>


					<UserAgreement />

					<div className="errors">
						<ReactCSSTransitionGroup transitionName="fadeOutIn">
							{Object.keys(errors).map(ref =>
								<small key={ref} className="error">{errors[ref].message}</small>
							)}
						</ReactCSSTransitionGroup>
					</div>

					<input type="submit"
							id="signup:submit"
							className="small-12 columns tiny button"
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
