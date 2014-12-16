/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var Constants = require('../Constants');
var t = require('common/locale').translate;
var isFunction = require('dataserverinterface/utils/isfunction');
var RadioGroup = require('./RadioGroup');
var ToggleFieldset = require('./ToggleFieldset');
var Select = require('common/forms/components/Select');
var Checkbox = require('common/forms/components/Checkbox');
var PanelNoButton = require('common/components/PanelNoButton');
var LocalizedHTML = require('common/components/LocalizedHTML');

var hash = require('object-hash');

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

// store field values outside of component state
// so we can update without triggering a re-render.
var FieldValuesStore = {
	_fieldValues: {},
	getValues: function() {
		return Object.assign({}, this._fieldValues);
	},
	setValue: function(name, value) {
		this._fieldValues[name] = value;
	},
	getValue: function(name) {
		return this._fieldValues[name];
	},
	clearValue: function(name) {
		delete this._fieldValues[name];
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

	getInitialState: function() {
		return {
			fieldValues: {}
		};
	},

	_onBlur: function(event) {
		this.updateFieldValueState(event);
	},

	_radioChanged: function(event) {
		this.updateFieldValueState(event);
	},

	_checkboxChanged: function(event) {
		this.updateFieldValueState(event);	
	},

	updateFieldValueState: function(event) {
		var target = event.target;
		var field = target.name;
		var value = target.value;
		var tmp = Object.assign({}, this.state.fieldValues);

		if(target.type === 'checkbox' && !target.checked) {
			delete tmp[field];
		}
		else if (value || tmp.hasOwnProperty(field)) {
			// ^ don't set an empty value if there's not already
			// an entry for this field in this.state.fieldValues
			tmp[field] = value;
			this.setState({ fieldValues: tmp });
		}
		if (isFunction(this.props.onFieldValuesChange)) {
			this.props.onFieldValuesChange(tmp);
		}
	},

	renderField: function(field, values) {
		var state = this.state;
		var err = (state.errors||{})[field.ref];
		var cssClass = err ? ['error'] : [];
		var tr = this.props.translator||t;
		var type = field.type;
		var inlineSubfields = null;

		this._visibleFields.push(field);

		if(field.required) {
			cssClass.push('required');
		}

		if(this.props.errorFieldRefs.has(field.ref)) {
			cssClass.push('error');
		}

		if (!type || type === 'number') {
			type = 'text';
		}

		var ref = field.ref;

		// default placeholder for inputs
		var translateOptions = {
			fallback: ''
		};

		var configuredValue = (field.value||field.defaultValue);

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
			translator: tr,
			pattern: (field.type === 'number' && '[0-9]*') || null
		};

		var input;
		switch(field.type) {
			case 'textarea':
				input = React.DOM.textarea;
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
				props.onChange = this._checkboxChanged;
				props.value = field.value;
				break;

			case 'toggleFieldset':
				input = ToggleFieldset;
				break;

			default:
				input = React.DOM.input;
		}

		var component = type === 'label' ?
			React.DOM.label({ ref: ref, className: cssClass.join(' ') }, tr(ref, translateOptions)) :
			input(props);

		var subfields = this._renderActiveSubfields(field);

		if (subfields.length > 0) {
			inlineSubfields = React.DOM.div(
				{
					className: 'subfields',
					key: ref.concat('-subfields')
				},
				subfields
			);
		}

		return React.DOM.div(
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
		var activeInlineSubfields = relatedConfigs.filter(function(item) {
			return item.config[0].type === Constants.SUBFIELDS && item.isActive;
		});

		return activeInlineSubfields.map(function(item) {
			return item.config[0].content.map(function(field) {
				return this.renderField(field, this.state.fieldValues);
			}.bind(this));
		}.bind(this));
	},

	renderFieldset: function(fieldset, values, index) {
		var legend = fieldset.title ? React.DOM.legend({key: fieldset.title.concat('-legend')}, fieldset.title) : null;
		var fields = fieldset.fields.map(function(field) {
			return this.renderField(field, values);
		}.bind(this));

		var fieldsetComponent = React.DOM.fieldset(
			{
				className: fieldset.className || null,
				key: hash(fieldset)
			},
			[
				legend,
				fields
			]
		);

		var related = [];

		RelatedConfigsStash.get().forEach(function(config) {
			if(config.isActive) {
				var conf = config.config[0];
				switch(conf.type) {
					case Constants.FORM_CONFIG:
						related.push(this._renderFormConfig(conf.content, values));
						break;
					case Constants.MESSAGE:
						related.push(<PanelNoButton key={hash(conf)}><LocalizedHTML key={conf.content} /></PanelNoButton>);
						break;
					case Constants.SUBFIELDS:
						// inline subfields will be rendered with the field itself;
						break;
					default:
						console.warn('Unrecognized related config type: %O', config);
				}
			}
			// if(config.isActive && config.config[0].type === Constants.FORM_CONFIG) {
			// 	related.push(this._renderFormConfig(config.config[0].content, values));
			// }
		}.bind(this));

		return React.DOM.div(
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
		var fieldsets = config.map(function(fieldset, index) {
			return this.renderFieldset(fieldset, values, index);
		}.bind(this));
		return (
			React.DOM.div({className: 'form-render', key: hash(config)}, fieldsets)
		);
	},

	_getRelatedConfigs: function(fieldConfig) {
		var result = [];
		var currentValue = this.state.fieldValues[fieldConfig.ref];
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

	componentWillUpdate: function() {
		this._visibleFields.length = 0;
	},

	componentDidUpdate: function() {
		this._pruneFieldValues();
		if (isFunction(this.props.onFieldsChange)) {
			this.props.onFieldsChange(this._getVisibleFieldRefs());
		}
	},

	_getVisibleFieldRefs: function() {
		return new Set(
			this._visibleFields.map(function(item) {
				return item.ref;
			})
		);
	},

	// after an update clear fieldValue entries
	// for fields no longer in the form.
	_pruneFieldValues: function() {
		var changed = false;
		var fieldValues = this.state.fieldValues;
		var _visibleFieldRefs = this._getVisibleFieldRefs();
		Object.keys(fieldValues).forEach(function(key) {
			if (!_visibleFieldRefs.has(key)) {
				delete fieldValues[key];
				changed = true;
			}
		});
		if(changed && isFunction(this.props.onFieldValuesChange)) {
			this.props.onFieldValuesChange(this.state.fieldValues);
		}
	},

	render: function() {
		var renderedForm = this._renderFormConfig(this.props.formConfig, this.state.fieldValues);

		return (
			<div>
				{renderedForm}
				{this.props.children}
			</div>
		);
	}

});

module.exports = RelatedFormPanel;