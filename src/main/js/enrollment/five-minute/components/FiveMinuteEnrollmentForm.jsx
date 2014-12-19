/** @jsx React.DOM */

'use strict';

var React = require('react/addons');
var FieldRender = require('common/forms/mixins/RenderFormConfigMixin');
var RelatedFormPanel = require('common/forms/components/RelatedFormPanel');
var FormErrors = require('common/forms/components/FormErrors');
var _formConfig = require('../configs/FiveMinuteEnrollmentForm');
var t = require('common/locale').scoped('ENROLLMENT.forms.fiveminute');
var ButtonFullWidth = require('common/forms/components/ButtonFullWidth');
var Loading = require('common/components/Loading');
var Actions = require('../Actions');
var Store = require('../Store');
var FieldValuesStore = require('common/forms/FieldValuesStore');
var FormConstants = require('common/forms/Constants');
var Constants = require('../Constants');
var update = React.addons.update;

var _rootFormRef = 'rootForm';

var FiveMinuteEnrollmentForm = React.createClass({

	mixins: [FieldRender],

	getInitialState: function() {
		return {
			busy: false,
			errors: []
		};
	},

	componentDidMount: function() {
		Store.addChangeListener(this._storeChange);
		FieldValuesStore.addChangeListener(this.fieldValuesStoreChange);
	},

	componentWillUnmount: function() {
		Store.removeChangeListener(this._storeChange);
		FieldValuesStore.removeChangeListener(this.fieldValuesStoreChange);
	},

	_storeChange: function(event) {
		if(event.isError) {
			var errs = update(
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
			case Constants.events.ADMISSION_SUCCESS:

				break;
		}
		console.group('fiveminute store event');
		console.debug(event);
		console.groupEnd();
	},

	fieldValuesStoreChange: function(event) {
		switch(event.type) {
			// case FormConstants.FIELD_VALUES_REMOVED:
			// 	var removed = (event.removed||[]);
			// 	removed.forEach(function(fieldName) {
			// 		this._removeError(fieldName);
			// 	});
			// 	break;

			case FormConstants.FIELD_VALUE_CHANGE:
				if (event.fieldName === 'signature') {
					this.forceUpdate();
				}
				break;

			case FormConstants.AVAILABLE_FIELDS_CHANGED:
				this._pruneErrors(event.fields);
				break;
		}
	},

	inputFocused: function(event) {
		var ref = event.target.name;
		this._removeError(ref);
	},

	_removeError: function(ref) {
		var errors = this.state.errors;
		var error = errors.find(function(entry) {
			return entry.field === ref;
		});
		var index = errors.indexOf(error);
		if (index > -1) {
			var newErrs = update(errors, {$splice: [[index, 1]]}); // errors.splice(index, 1);
			console.debug('remove error %s', error.field);
			this.setState({
				errors: newErrs
			});
		}
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
		var fields = FieldValuesStore.getValues();

		if (this._isValid()) {
			this.setState({
				busy: true
			});
			Actions.preflightAndSubmit(fields);
		}
	},

	_isValid: function() {
		var errors = [];
		var fields = this.refs[_rootFormRef].getVisibleFields();
		var values = FieldValuesStore.getValues();
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
		return !!FieldValuesStore.getValues().signature;
	},

	render: function() {

		if (this.state.busy) {
			return <Loading />;
		}

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
