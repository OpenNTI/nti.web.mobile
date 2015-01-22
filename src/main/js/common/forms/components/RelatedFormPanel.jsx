'use strict';

var React = require('react/addons');

var t = require('common/locale').translate;

var Constants = require('../Constants');
var FieldValuesStore = require('../FieldValuesStore');

var RadioGroup = require('./RadioGroup');
var ToggleFieldset = require('./ToggleFieldset');
var Select = require('common/forms/components/Select');
var Checkbox = require('common/forms/components/Checkbox');

var PanelNoButton = require('common/components/PanelNoButton');
var LocalizedHTML = require('common/components/LocalizedHTML');

var hash = require('object-hash');

// components that render their own label:
var _labelIsRenderedByComponent = new Set();

// safari doesn't support construction of a set from an array (!?)
// so we'll create the Set empty and add each item.
['radiogroup', 'select', 'checkbox','toggleFieldset'].forEach(function(comp) {
	_labelIsRenderedByComponent.add(comp);
});

// just a dumb wrapper around an array to isolate the
// accumulation of related configs during render.
var RelatedConfigsStash = {
	_stash: [],
	get: function() {
		return this._stash;
	},
	clear: function() {
		this._stash.length = 0;
	},
	concat: function(elements) {
		this._stash = this._stash.concat(elements);
	}
};

var RelatedFormPanel = React.createClass({

	_visibleFields: [],

	statics: {
		// static because it's easier to test
		_getInlineSubfields: function(field, currentValue) {
			var selectedOption = (field.options||[]).find(function(item) {
				return item.value === currentValue;
			});
			return (selectedOption.related||[]).filter(function(item) {
				return item.type === Constants.SUBFIELDS;
			});
		}
	},

	propTypes: {
		formConfig: React.PropTypes.array.isRequired,
		translator: React.PropTypes.func
	},

	getDefaultProps: function() {
		return {
			errorFieldRefs: new Set()
		};
	},

	componentDidMount: function() {
		FieldValuesStore.addChangeListener(this._fieldValueChange);
	},

	componentWillUnmount: function() {
		FieldValuesStore.removeChangeListener(this._fieldValueChange);
	},

	_fieldValueChange: function(/* event */) {
		this.forceUpdate();
	},

	componentWillUpdate: function() {
		this._visibleFields.length = 0;
	},

	componentDidUpdate: function() {
		var visible = this._getVisibleFieldRefs();
		FieldValuesStore.setAvailableFields(visible);
	},

	_onBlur: function(event) {
		FieldValuesStore.updateFieldValue(event);
	},

	_radioChanged: function(event) {
		FieldValuesStore.updateFieldValue(event);
	},

	_checkboxChanged: function(event) {
		FieldValuesStore.updateFieldValue(event);
	},

	renderField: function(field, values) {

		var cssClass = [];
		var tr = this.props.translator||t;
		var type = field.type || 'text';
		var inlineSubfields = null;

		this._visibleFields.push(field);

		if(field.required) {
			cssClass.push('required');
		}

		if(this.props.errorFieldRefs.has(field.ref)) {
			cssClass.push('error');
		}

		// if (!type || type === 'number') {
		// 	type = 'text';
		// }

		var ref = field.ref;

		// default placeholder for inputs
		var translateOptions = {
			fallback: ''
		};

		var configuredValue = field.type !== 'checkbox' && (field.value||field.defaultValue);

		// explicit test against undefined because the value could be zero which is falsy.
		if (configuredValue !== undefined && (type === 'hidden' || !FieldValuesStore.getValue(ref))) {
			FieldValuesStore.setValue(ref, configuredValue);
		}

		var props = {
			ref: ref,
			name: ref,
			onBlur: this._onBlur,
			onFocus: this.props.inputFocus,
			placeholder: tr(ref,translateOptions),
			className: cssClass.join(' '),
			defaultValue: (values||{})[ref]||configuredValue,
			type: type,
			field: field,
			// ToggleFieldset needs to call renderField.
			renderField: this.renderField,
			options: field.options||null,
			// pattern: (field.type === 'number' && '[0-9]*') || null,
			translator: tr
		};

		var input;
		switch(field.type) {
		//TODO: remove all switch statements, replace with functional object literals. No new switch statements.
			case 'textarea':
				input = 'textarea';
				break;

			case 'select':
				input = Select;
				if (field.optionsLink) {
					props.optionsLink = field.optionsLink;
				}
				break;

			case 'radiogroup':
				input = RadioGroup;
				props.onChange = this._radioChanged;
				RelatedConfigsStash.concat(this._getRelatedConfigs(field));
				break;

			case 'checkbox':
				input = Checkbox;
				Object.assign(props, {
					onChange: this._checkboxChanged,
					value: field.value,
					checked: (FieldValuesStore.getValue(ref) === field.value)
				});
				break;

			case 'toggleFieldset':
				input = ToggleFieldset;
				break;

			default:
				input = 'input';
		}

		var component = type === 'label' ?
			React.createElement('label', { ref: ref, className: cssClass.join(' ') }, tr(ref, translateOptions)) :
			React.createElement(input, props);

		if (field.label && !_labelIsRenderedByComponent.has(type)) {
			component = React.createElement('label', {},
				React.createElement('span', { className: 'fieldLabel' }, field.label),
				component
				);
		}

		var subfields = this._renderActiveSubfields(field);

		if (subfields.length > 0) {
			inlineSubfields = React.createElement('div',
				{
					className: 'subfields',
					key: ref.concat('-subfields')
				},
				subfields
			);
		}

		return React.createElement('div',
			{
				key: hash(field),
				className: ref
			},
			component,
			inlineSubfields
		);
	},

	_renderActiveSubfields: function(fieldConfig) {
		var relatedConfigs = this._getRelatedConfigs(fieldConfig);
		var activeInlineSubfields = relatedConfigs.filter(item =>
			item.config[0].type === Constants.SUBFIELDS && item.isActive);

		var values = FieldValuesStore.getValues();
		return activeInlineSubfields.map(item=>
			item.config[0].content.map(field=>
				this.renderField(field, values)
				)
			);
	},

	renderFieldset: function(fieldset, values, index) {
		var fieldsetComponent = React.createElement('fieldset',
			{
				className: fieldset.className || null,
				key: hash(fieldset)
			},
			!fieldset.title ? null : (<legend>{fieldset.title}</legend>),
			fieldset.fields.map(field=>this.renderField(field, values))
		);

		var related = [];

		RelatedConfigsStash.get().forEach(function(config) {
			if(config.isActive) {
				// var conf = config.config[0];
				config.config.forEach(function(conf) {
					switch(conf.type) {
					//TODO: remove all switch statements, replace with functional object literals. No new switch statements.
						case Constants.FORM_CONFIG:
							related.push(this._renderFormConfig(conf.content, values));
							break;
						case Constants.MESSAGE:
							related.push(<PanelNoButton key={hash(conf)}><LocalizedHTML stringId={conf.content} /></PanelNoButton>);
							break;
						case Constants.SUBFIELDS:
							// inline subfields will be rendered with the field itself;
							break;
						default:
							console.warn('Unrecognized related config type: %O', config);
					}
				}.bind(this));
			}
			// if(config.isActive && config.config[0].type === Constants.FORM_CONFIG) {
			// 	related.push(this._renderFormConfig(config.config[0].content, values));
			// }
		}.bind(this));

		return React.createElement('div',
			{
				className: 'fieldset-'.concat(index),
				key: hash(fieldset)
			},
			fieldsetComponent,
			related
		);
	},

	_renderFormConfig: function(config, values) {
		RelatedConfigsStash.clear();
		var args = ['div', {className: 'form-render', key: hash(config)}].concat(
			config.map((fieldset, index)=>this.renderFieldset(fieldset, values, index)));

		return React.createElement.apply(null, args);
	},

	_getRelatedConfigs: function(fieldConfig) {
		var result = [];
		var currentValue = FieldValuesStore.getValue(fieldConfig.ref);
		(fieldConfig.options||[]).forEach(function(option) {
			if(option.related) {
				result.push({
					isActive: currentValue && option.value === currentValue,
					config: option.related
				});
			}
		});
		return result;
	},

	getVisibleFields: function() {
		return this._visibleFields.slice(0);
	},

	_getVisibleFieldRefs: function() {
		return new Set(
			this._visibleFields.map(function(item) {
				return item.ref;
			})
		);
	},

	render: function() {
		return (
			<div>
				{this._renderFormConfig(this.props.formConfig, FieldValuesStore.getValues())}
				{this.props.children}
			</div>
		);
	}

});

module.exports = RelatedFormPanel;
