/* globals Stripe jQuery */
import React from 'react';
import cx from 'classnames';

import Loading from 'common/components/TinyLoader';

import ExternalLibraryManager from 'common/mixins/ExternalLibraryManager';
import {clearLoadingFlag} from 'common/utils/react-state';
import {scoped} from 'common/locale';

//These strings should probably move into a more generic place in the strings.
const t = scoped('ENROLLMENT.forms.storeenrollment');
const t2 = scoped('ENROLLMENT');

export default React.createClass({
	displayName: 'CreditCardForm',
	mixins: [ExternalLibraryManager],

	propTypes: {
		className: React.PropTypes.string,
		onChange: React.PropTypes.func,
		defaultValues: React.PropTypes.object
	},


	getInitialState () {
		return {
			errors: {}
		};
	},


	componentWillMount () {
		this.setState({loading: true});
	},


	componentDidMount () {
		this.ensureExternalLibrary(['jquery.payment', 'stripe'])
			.then(() => clearLoadingFlag(this));
	},


	componentDidUpdate (_, prevState) {
		const {state: {loading}, refs: {cvc, exp, number}} = this;
		if (loading !== prevState.loading && typeof jQuery !== 'undefined') {
			jQuery(number).payment('formatCardNumber');
			jQuery(exp).payment('formatCardExpiry');
			jQuery(cvc).payment('formatCardCVC');
		}
	},


	getValue () {
		const {cvc: cvcEl, exp: expEl, number: numberEl, name: nameEl} = this.refs;
		const getValue = x => x && x.value && x.value.trim();

		const {month, year} =
			jQuery(expEl).payment('cardExpiryVal');

		return {
			name: getValue(nameEl),
			number: getValue(numberEl),
			cvc: getValue(cvcEl),
			exp_month: month, exp_year: year // eslint-disable-line camelcase
		};
	},


	delegateError (err) {
		let fields = {
			name: 'name',
			number: 'number',
			cvc: 'cvc',
			exp: 'exp',
			exp_month: 'exp', exp_year: 'exp' // eslint-disable-line camelcase
		};

		for (let key of Object.keys(err)) {
			if (key in fields) {
				this.setState({errors: {[fields[key]]: err[key]}});
				return true;
			}
		}
	},


	validate (ignoreEmpty = true) {
		const {name, number, cvc, exp_month: mon, exp_year: year} = this.getValue(); // eslint-disable-line camelcase
		const errors = {};
		const hasValue = x => (x || '').length > 0 || !ignoreEmpty;

		if(name.length === 0) {
			errors.name = {message: t2('requiredField')};
		}

		if(hasValue(number) && !Stripe.card.validateCardNumber(number)) {
			errors.number = {message: t2('invalidCardNumber')};
		}

		if(hasValue(cvc) && !Stripe.card.validateCVC(cvc)) {
			errors.cvc = {message: t2('invalidCVC')};
		}

		if(hasValue(mon) && hasValue(year) && !Stripe.card.validateExpiry(mon, year)) {
			errors.exp = {message: t2('invalidExpiration')};
		}

		const hasErrors = Object.keys(errors).length > 0;

		this.setState({errors: hasErrors ? errors : void 0});

		return !hasErrors;
	},


	onChange (e) {
		this.onFieldEventClearError(e);
		let {onChange} = this.props;
		if (onChange) {
			onChange();
		}
	},


	onFieldEventClearError (e) {
		let {name} = e.target;
		let {errors} = this.state;

		let line2 = {number:1, exp:1, cvc: 1};

		if (errors) {
			Object.assign({}, errors);

			delete errors[name];
			if (name in line2) {
				for (let line of Object.keys(line2)) {
					delete errors[line];
				}
			}

			this.setState({errors});
		}
	},

	render () {
		const {props: {className, defaultValues = {}}, state: {loading, errors = {}}} = this;

		const secondLineError = errors.number || errors.exp || errors.cvc;

		if (loading) {
			return ( <Loading/> );
		}

		return (
			<fieldset className={cx('credit-card-form', className)}>
				<legend>Credit Card</legend>
				<div className="name">
					<input name="name" ref="name"
						placeholder={t('name')}
						className={cx('required', {error: errors.name})}
						type="text"
						defaultValue={defaultValues.name}
						onFocus={this.onFieldEventClearError}
						onChange={this.onChange}
						/>
					{errors.name && <div className="error message">{errors.name.message}</div>}
				</div>
				<div>
					<span className="number" >
						<input name="number" ref="number"
							placeholder={t('number')}
							className={cx('required', {error: errors.number})}
							type="text"
							pattern="[0-9]*"
							autoComplete="cc-number"
							onFocus={this.onFieldEventClearError}
							onChange={this.onChange}
							/>
					</span>
					<span className="exp" >
						<input name="exp" ref="exp"
							placeholder={t('exp_')}
							className={cx('required', {error: errors.exp})}
							type="text"
							pattern="[0-9]*"
							autoComplete="cc-exp"
							onFocus={this.onFieldEventClearError}
							onChange={this.onChange}
							/>
					</span>
					<span className="cvc" >
						<input name="cvc" ref="cvc"
							placeholder={t('cvc')}
							className={cx('required', {error: errors.cvc})}
							type="text"
							pattern="[0-9]*"
							autoComplete="off"
							onFocus={this.onFieldEventClearError}
							onChange={this.onChange}
							/>
					</span>
					{secondLineError && <div className="error message">{secondLineError.message}</div>}
				</div>
			</fieldset>
		);
	}
});
