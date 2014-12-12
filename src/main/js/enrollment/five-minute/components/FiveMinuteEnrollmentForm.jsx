/** @jsx React.DOM */

'use strict';

var React = require('react/addons');
var FieldRender = require('common/forms/mixins/RenderFormConfigMixin');
var RelatedFormPanel = require('common/forms/components/RelatedFormPanel2');
var RelatedFormStore = require('common/forms/RelatedFormStore');
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
	
	componentDidMount: function() {
		RelatedFormStore.addChangeListener(this._storeChange);
	},

	componentWillUnmount: function() {
		RelatedFormStore.removeChangeListener(this._storeChange);
	},

	_storeChange: function(event) {
		if(event.isError) {
			this.setState({
				errors: RelatedFormStore.getErrors(this.props.storeContextId)
			});
		}
	},

	fieldValuesChanged: function(fieldValues) {
		this.setState({
			fieldValues: fieldValues
		});
	},

	_handleSubmit: function() {
		var fields = this.state.fieldValues; //RelatedFormStore.getValues(this.props.storeContextId);
		console.group('getVisibleFields');
		this.refs[_rootFormRef].getVisibleFields().forEach(function(item) {
			console.debug(item.ref, item.required ? '- (required)' : '');
		});
		console.groupEnd();
		if (this._isValid()) {
			Actions.preflight(fields, this.props.storeContextId);	
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

	render: function() {

		var title = t('admissionTitle');
		var errors = this.state.errors; // RelatedFormStore.getErrors(this.props.storeContextId);
		var errorRefs = new Set(errors.map(function(err) {
			return err.field
		}));

		return (
			<div className="fiveminuteform">
				<div className="row">
					<div className="medium-6 medium-centered columns">
						<h2>{title}</h2>
						<p>{t('admissionDescription')}</p>
						<RelatedFormPanel
							onFieldValuesChange={this.fieldValuesChanged}
							ref={_rootFormRef}
							title={title}
							formConfig={_formConfig}
							errorFieldRefs={errorRefs}
							translator={t} />
						<FormErrors errors={errors} />
						<ButtonFullWidth onClick={this._handleSubmit}>{t('submit')}</ButtonFullWidth>
					</div>
				</div>
			</div>
		);
	}

});

module.exports = FiveMinuteEnrollmentForm;
