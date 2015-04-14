import React from 'react';
import update from 'react/lib/update';

import ButtonFullWidth from 'common/forms/components/ButtonFullWidth';
import FieldRender from 'common/forms/mixins/RenderFormConfigMixin';
import FieldValuesStore from 'common/forms/FieldValuesStore';
import FormConstants from 'common/forms/Constants';
import FormErrors from 'common/forms/components/FormErrors';
import RelatedFormPanel from 'common/forms/components/RelatedFormPanel';

import Loading from 'common/components/Loading';
import {scoped} from 'common/locale';

import _formConfig from '../configs/FiveMinuteEnrollmentForm';

import Actions from '../Actions';
import Store from '../Store';

import {
	ADMISSION_SUCCESS,
	IS_CONCURRENT_FORM
} from '../Constants';

const t = scoped('ENROLLMENT.forms.fiveminute');

let ROOT_FORM_REF = 'rootForm';

export default React.createClass({
	displayName: 'FiveMinuteEnrollmentForm',

	mixins: [FieldRender],

	getInitialState () {
		return {
			busy: false,
			errors: []
		};
	},

	componentDidMount () {
		Store.addChangeListener(this.onStoreChange);
		FieldValuesStore.addChangeListener(this.fieldValuesStoreChange);
	},

	componentWillUnmount () {
		Store.removeChangeListener(this.onStoreChange);
		FieldValuesStore.removeChangeListener(this.fieldValuesStoreChange);
	},

	onStoreChange (event) {
		if(event.isError) {
			let errs = update(
				this.state.errors,
				{$push: [{
					field: event.reason.field,
					message: event.reason.message
				}]}
			);
			this.setState({
				errors: errs,
				busy: false
			});
			// this.state.errors.push({
			// 	field: event.reason.field,
			// 	message: event.reason.message,
			// 	busy: false
			// });
			// this.forceUpdate();
			return;
		}
		switch(event.type) {
		//TODO: remove all switch statements, replace with functional object literals. No new switch statements.
			case ADMISSION_SUCCESS:

				break;
		}
		console.group('fiveminute store event');
		console.debug(event);
		console.groupEnd();
	},

	fieldValuesStoreChange (event) {
		switch(event.type) {
		//TODO: remove all switch statements, replace with functional object literals. No new switch statements.

			case FormConstants.FIELD_VALUE_CHANGE:
				if (event.fieldName === 'signature' || event.fieldName === 'contactme') {
					this.forceUpdate();
				}
				break;

			case FormConstants.AVAILABLE_FIELDS_CHANGED:
				this.pruneErrors(event.fields);
				break;
		}
	},

	inputFocused (event) {
		let ref = event.target.name;
		this.removeError(ref);
	},

	removeError (ref) {
		let errors = this.state.errors;
		let error = errors.find(function(entry) {
			return entry.field === ref;
		});
		let index = errors.indexOf(error);
		if (index > -1) {
			let newErrs = update(errors, {$splice: [[index, 1]]}); // errors.splice(index, 1);
			console.debug('remove error %s', error.field);
			this.setState({
				errors: newErrs
			});
		}
		return !!error;
	},

	pruneErrors (visibleFieldRefs) {
		let errs = this.state.errors;
		let newErrs = [];
		let anyRemoved = false;
		errs.forEach(function(err) {
			if (visibleFieldRefs.has(err.field)) {
				newErrs.push(err);
			} else {
				anyRemoved = true;
			}
		});
		if (anyRemoved) {
			this.setState({
				errors: newErrs
			});
		}
	},

	handleSubmit () {
		let fields = FieldValuesStore.getValues();

		if (this.isValid()) {
			this.setState({
				busy: true
			});
			if (fields[IS_CONCURRENT_FORM]) {
				Actions.requestConcurrentEnrollment(fields);
			}
			else {
				Actions.preflightAndSubmit(fields);
			}
		}
	},

	isValid () {
		let errors = [];
		let fields = this.refs[ROOT_FORM_REF].getVisibleFields();
		let values = FieldValuesStore.getValues();
		fields.forEach(field => {
			let value = values[field.ref];
			if(field.required && !value) {
				errors.push({
					field: field.ref,
					message: 'Please complete all required fields'
				});
			}
		});
		this.setState({
			errors: errors
		});
		return errors.length === 0;
	},

	submitEnabled () {
		let values = FieldValuesStore.getValues();
		return !!(values.signature || values.contactme);
	},

	render () {

		if (this.state.busy) {
			return <Loading />;
		}

		let title = t('admissionTitle');
		let errors = this.state.errors;
		let errorRefs = new Set(errors.map(function(err) {
			return err.field;
		}));

		return (
			<div className="fiveminuteform">
				<div className="row">
					<div className="medium-6 medium-centered columns">
						<h2>{title}</h2>
						<p>{t('admissionDescription')}</p>
						<FormErrors errors={errors} />
						<RelatedFormPanel
							inputFocus={this.inputFocused}
							ref={ROOT_FORM_REF}
							title={title}
							formConfig={_formConfig}
							errorFieldRefs={errorRefs}
							translator={t} />
						<FormErrors errors={errors} />
						<ButtonFullWidth enabled={this.submitEnabled()} onClick={this.handleSubmit}>{t('submit')}</ButtonFullWidth>
					</div>
				</div>
			</div>
		);
	}

});
