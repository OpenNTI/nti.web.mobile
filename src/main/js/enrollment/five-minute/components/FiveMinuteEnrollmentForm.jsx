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

var _rootFormRef = 'rootForm';

var FiveMinuteEnrollmentForm = React.createClass({

	mixins: [FieldRender],

	getInitialState: function() {
		return {
			fieldValues: {},
			errors: []
		};
	},

	_storeChange: function(event) {
		if(event.isError) {
			this.state.errors.push({
				field: event.field,
				message: event.error.message
			});
			this.forceUpdate();
		}
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
			Actions.preflight(fields);
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
