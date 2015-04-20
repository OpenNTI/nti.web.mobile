

import React from 'react';
import {scoped} from 'common/locale';
let t = scoped('LOGIN.forms.createaccount');

import Loading from 'common/components/Loading';
import UserAgreement from './UserAgreement';

import Router from 'react-router-component';
let NavigatableMixin = Router.NavigatableMixin;
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';
import {ERROR_EVENT} from 'common/constants/Events';

import indexArrayByKey from 'nti.lib.interfaces/utils/array-index-by-key';

import Store from '../Store';
import Actions from '../Actions';
import * as LoginActions from '../../Actions';
import LoginStore from '../../Store';

import RenderFormConfigMixin from 'common/forms/mixins/RenderFormConfigMixin';
import {RENDERED_FORM_EVENT_HANDLERS as Events} from 'common/forms/Constants';

console.debug(RenderFormConfigMixin);

const fullname = 'SignupForm:fullname';
const requiredFieldsFilled = 'SignupForm:requiredFieldsFilled';
const handleSubmit = 'SignupForm:handleSubmit';

export default React.createClass({

	displayName: 'SignupForm',

	mixins: [NavigatableMixin, RenderFormConfigMixin],

	propTypes: {
		privacyUrl: React.PropTypes.string,
		basePath: React.PropTypes.string
	},

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

	[fullname]: function(tmpValues) {
		let values = tmpValues || this.state.fieldValues;
		return [values.fname, values.lname].join(' ');
	},


	[handleSubmit]: function(evt) {
		evt.preventDefault();
		if(Object.keys(this.state.errors).length > 0) {
			return;
		}
		console.log('create account.');
		let fields = Object.assign(this.state.fieldValues, {realname: this[fullname]()});

		this.setState({ busy: true });

		Actions.clearErrors();
		Actions.preflightAndCreateAccount({
			fields: fields
		});
		return false;
	},

	storeChanged: function(event) {
		let errs;
		console.debug('SignupForm received Store change event: %O', event);
		if (event.type === 'created') {
			LoginActions.deleteTOS();
			let returnPath = LoginStore.getReturnPath();
			let path = returnPath || this.props.basePath;
			window.location.replace(path);
			return;
		}

		if (event.type === ERROR_EVENT) {
			errs = indexArrayByKey(Store.getErrors(), 'field');
			// realname is a synthetic field; map its error messages to the last name field.
			// if (errs['realname'] && !errs['lname']) {
			// 	errs['lname'] = errs['realname'];
			// }
		}

		this.setState({busy: false, errors: errs});
	},

	componentWillMount: function() {
		Store.getFormConfig().then(function(value) {
			this.setState({
				loading: false,
				formConfig: value
			});
		}.bind(this));
	},

	componentDidMount: function() {
		Store.addChangeListener(this.storeChanged);
	},


	componentWillUnmount: function() {
		Store.removeChangeListener(this.storeChanged);
	},

	[Events.ON_BLUR]: function(event) {
		let target = event.target;
		let field = target.name;
		let value = target.value;
		let tmp = Object.assign({}, this.state.fieldValues);

		if (!value && !tmp.hasOwnProperty(field)) {
			return;
		}

		tmp[field] = value;


		if (tmp.hasOwnProperty('fname') && tmp.hasOwnProperty('lname')) {
			tmp.realname = this[fullname](tmp);
		}

		this.setState({ fieldValues: tmp });

		// Actions.preflight({
		// 	fields: tmp
		// });
	},

	[Events.ON_CHANGE](event) {
		this[Events.ON_BLUR](event);
	},

	isSubmitEnabled: function() {
		let state = this.state;
		return !state.busy && Object.keys(state.errors).length === 0 &&
				this[requiredFieldsFilled]();
	},

	[requiredFieldsFilled]: function() {
		let values = this.state.fieldValues;
		return this.state.formConfig.every(function(fieldset) {
			return fieldset.fields.every(function(field) {
				return !field.required || (values[field.ref] || '').length > 0;
			});
		});
	},

	render: function() {
		let state = this.state;
		let enabled = this.isSubmitEnabled();

		if (state.loading) {
			return <Loading />;
		}

		let fields = this.renderFormConfig(state.formConfig, state.fieldValues, t);

		return (
			<div className="row">
				<form autoComplete="off" className="create-account-form medium-6 medium-centered columns" onSubmit={this[handleSubmit]}>
					{fields}
					<UserAgreement />
					<div className='errors'>
							<ReactCSSTransitionGroup transitionName="messages">
								{Object.keys(state.errors).map(
									function(ref) {
										let err = state.errors[ref];
										console.debug(err);
										return (<small key={ref} className='error'>{err.message}</small>);
									})}
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

