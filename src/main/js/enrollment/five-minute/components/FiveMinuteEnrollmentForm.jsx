import './FiveMinuteEnrollmentForm.scss';
import React from 'react';
import createReactClass from 'create-react-class';
import Logger from '@nti/util-logger';
import {Loading} from '@nti/web-commons';
import {scoped} from '@nti/lib-locale';

import Button from 'forms/components/Button';
import FieldRender from 'forms/mixins/RenderFormConfigMixin';
import FieldValuesStore from 'forms/FieldValuesStore';
import * as FormConstants from 'forms/Constants';
import FormErrors from 'forms/components/FormErrors';
import RelatedFormPanel from 'forms/components/RelatedFormPanel';


import _formConfig from '../configs/FiveMinuteEnrollmentForm';
import Autopopulator from '../Autopopulator';
import {requestConcurrentEnrollment, preflightAndSubmit} from '../Actions';
import Store from '../Store';
import {
	IS_CONCURRENT_FORM
} from '../Constants';

const logger = Logger.get('enrollment:five-minute:components:FiveMinuteEnrollmentForm');
const t = scoped('enrollment.forms.fiveminute', {
	admissionTitle: 'Admission to OU Janux',
	admissionDescription: 'Before you can earn college credit from the University of Oklahoma, we need you to answer some questions. Don’t worry, the admission process is free and should only take a few minutes.',
	submit: 'Submit Application',
});

const arrayToMap = (arr, field) => {
	let result = {};
	for(let obj of arr) {
		let key = obj[field];
		result[key] = obj;
	}
	return result;
};

export default createReactClass({
	displayName: 'FiveMinuteEnrollmentForm',
	mixins: [FieldRender],

	attachFormPanelRef (x) { this.formPanel = x; },

	getInitialState () {
		return {
			busy: false,
			errors: []
		};
	},

	componentDidMount () {
		Store.addChangeListener(this.onStoreChange);
		FieldValuesStore.setAutopopulator(new Autopopulator());
		FieldValuesStore.addChangeListener(this.fieldValuesStoreChange);
	},

	componentWillUnmount () {
		Store.removeChangeListener(this.onStoreChange);
		FieldValuesStore.setAutopopulator(null);
		FieldValuesStore.removeChangeListener(this.fieldValuesStoreChange);
	},

	onStoreChange (event) {
		if(event.isError) {
			const errs = [
				...this.state.errors,
				{
					field: event.reason.field,
					message: event.reason.Message || event.reason.message || event.reason.responseText
				}
			];
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

		logger.debug('fiveminute store event: %o', event);
	},

	fieldValuesStoreChange (event) {
		switch(event.type) {
		//TODO: remove all switch statements, replace with functional object literals. No new switch statements.

		case FormConstants.FIELD_VALUE_CHANGE:
			if ((/radio|checkbox/i).test((event.target || {}).type) || event.fieldName === 'signature' || event.fieldName === 'contactme') {
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
		let error = errors.find(entry => entry.field === ref);
		let index = errors.indexOf(error);
		if (index > -1) {
			this.setState({
				errors: [
					//Immutable way of removing an item (and creating a new array without it)
					...errors.slice(0, index),
					...errors.slice(index + 1)
				]
			});
		}
		return !!error;
	},

	pruneErrors (visibleFieldRefs) {
		let errs = this.state.errors;
		let newErrs = [];
		let anyRemoved = false;
		errs.forEach(err => {
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
		let fields = FieldValuesStore.getValues(true);

		if (this.isValid()) {
			this.setState({
				busy: true
			});
			if (fields[IS_CONCURRENT_FORM]) {
				requestConcurrentEnrollment(fields);
			}
			else {
				preflightAndSubmit(fields);
			}
		}
	},

	isValid () {
		let errors = [];
		let fields = this.formPanel.getVisibleFields();
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
			return <Loading.Mask />;
		}

		let title = t('admissionTitle');
		let {errors} = this.state;
		let errorsByRef = arrayToMap(errors, 'field');
		let errorRefs = new Set(errors.map(err => err.field));

		return (
			<div className="fiveminuteform">
				<div className="row">
					<div className="medium-6 medium-centered columns">
						<h2>{title}</h2>
						<p>{t('admissionDescription')}</p>
						<FormErrors errors={errorsByRef} />
						<RelatedFormPanel
							inputFocus={this.inputFocused}
							ref={this.attachFormPanelRef}
							title={title}
							formConfig={_formConfig}
							errorFieldRefs={errorRefs}
							translator={t} />
						<FormErrors errors={errorsByRef} />
						<Button className="columns"
							enabled={this.submitEnabled()}
							onClick={this.handleSubmit}>
							{t('submit')}
						</Button>
					</div>
				</div>
			</div>
		);
	}

});
