/** @jsx React.DOM */

'use strict';

var React = require('react/addons');
var FieldRender = require('common/forms/mixins/RenderFormConfigMixin');
var RelatedFormPanel = require('common/forms/components/RelatedFormPanel');
var FormErrors = require('common/forms/components/FormErrors');
var _formConfig = require('../configs/FiveMinuteEnrollmentForm');
var t = require('common/locale').scoped('ENROLLMENT.forms.fiveminute');
var ButtonFullWidth = require('common/forms/components/ButtonFullWidth');
var Actions = require('../Actions');
var Store = require('../Store');
var Constants = require('../Constants');

var _rootFormRef = 'rootForm';

var FiveMinuteEnrollmentForm = React.createClass({

	mixins: [FieldRender],

	getInitialState: function() {
		return {
			fieldValues: {},
			errors: []
		};
	},

	componentDidMount: function() {
		Store.addChangeListener(this._storeChange);
	},

	componentWillUnmount: function() {
		Store.removeChangeListener(this._storeChange);
	},

	_storeChange: function(event) {
		if(event.isError) {
			this.state.errors.push({
				field: event.reason.field,
				message: event.reason.message
			});
			this.forceUpdate();
			return;
		}
		switch(event.type) {
			case Constants.events.ADMISSION_SUCCESS:

				break;
		}
		console.group('fiveminute store event');
		console.debug(event);
		console.groupEnd();
	},

	fieldValuesChanged: function(fieldValues) {
		this.setState({
			fieldValues: fieldValues
		});
	},

	fieldsChanged: function(visibleFieldRefs) {
		// console.group('now visible:');
		// visibleFieldRefs.forEach(function(ref) {
		// 	console.debug(ref);
		// });
		// console.groupEnd();
		this._pruneErrors(visibleFieldRefs);
	},

	inputFocused: function(event) {
		var ref = event.target.ref;
		this._removeError(ref);
	},

	_removeError: function(ref) {
		var errors = this.state.errors;
		var error = errors.find(function(entry) {
			return entry.field === ref;
		});
		console.debug(errors.indexOf(error));
		return !!error;
	},

	_pruneErrors: function(visibleFieldRefs) {
		var errs = this.state.errors;
		var newErrs = [];
		var anyRemoved = false;
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

	_handleSubmit: function() {
		var fields = this.state.fieldValues;
		// console.group('getVisibleFields');
		// this.refs[_rootFormRef].getVisibleFields().forEach(function(item) {
		// 	console.debug(item.ref, item.required ? '- (required)' : '');
		// });
		// console.groupEnd();
		if (this._isValid()) {
			Actions.preflightAndSubmit(fields);
		}
	},

	_isValid: function() {
		var errors = [];
		var fields = this.refs[_rootFormRef].getVisibleFields();
		var values = this.state.fieldValues;
		fields.forEach(function(field){
			var value = values[field.ref];
			if(field.required && !value) {
				errors.push({
					field: field.ref,
					message: 'Please complete all required fields'
				});
			}
		}.bind(this));
		this.setState({
			errors: errors
		});
		return errors.length === 0;
	},

	_submitEnabled: function() {
		return !!this.state.fieldValues.signature;
	},

	render: function() {

		var title = t('admissionTitle');
		var errors = this.state.errors;
		var errorRefs = new Set(errors.map(function(err) {
			return err.field;
		}));

		return (
			<div className="fiveminuteform">
				<div className="row">
					<div className="medium-6 medium-centered columns">
						<h2>{title}</h2>
						<p>{t('admissionDescription')}</p>
						<RelatedFormPanel
							onFieldsChange={this.fieldsChanged}
							onFieldValuesChange={this.fieldValuesChanged}
							inputFocus={this.inputFocused}
							ref={_rootFormRef}
							title={title}
							formConfig={_formConfig}
							errorFieldRefs={errorRefs}
							translator={t} />
						<FormErrors errors={errors} />
						<ButtonFullWidth enabled={this._submitEnabled()} onClick={this._handleSubmit}>{t('submit')}</ButtonFullWidth>
					</div>
				</div>
			</div>
		);
	}

});

module.exports = FiveMinuteEnrollmentForm;
