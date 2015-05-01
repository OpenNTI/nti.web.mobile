import React from 'react';

import t from 'common/locale';

import * as Constants from '../Constants';
import FieldValuesStore from '../FieldValuesStore';

import RadioGroup from './RadioGroup';
import ToggleFieldset from './ToggleFieldset';
import Select from 'common/forms/components/Select';
import Checkbox from 'common/forms/components/Checkbox';

import PanelNoButton from 'common/components/PanelNoButton';
import LocalizedHTML from 'common/components/LocalizedHTML';

import hash from 'object-hash';

// components that render their own label:
let labelIsRenderedByComponent = new Set();

// safari doesn't support construction of a set from an array (!?)
// so we'll create the Set empty and add each item.
['radiogroup', 'select', 'checkbox', 'toggleFieldset'].forEach(comp => labelIsRenderedByComponent.add(comp));

// just a dumb wrapper around an array to isolate the
// accumulation of related configs during render.
let RelatedConfigsStash = {
	stash: [],
	get () {
		return this.stash;
	},
	clear () {
		this.stash.length = 0;
	},
	concat (elements) {
		this.stash = this.stash.concat(elements);
	}
};

const visibleFields = 'RelatedFormPanel:visibleFields';
const fieldValueChange = 'RelatedFormPanel:fieldValueChange';
const renderFormConfig = 'RelatedFormPanel:renderFormConfig';
const getVisibleFieldRefs = 'RelatedFormPanel:getVisibleFieldRefs';


let RelatedFormPanel = React.createClass({

	displayName: 'RelatedFormPanel',

	[visibleFields]: [],

	statics: {
		// static because it's easier to test
		_getInlineSubfields (field, currentValue) {
			let selectedOption = (field.options || []).find(item => item.value === currentValue);
			return (selectedOption.related || []).filter(item => item.type === Constants.SUBFIELDS);
		}
	},

	propTypes: {
		inputFocus: React.PropTypes.func,
		formConfig: React.PropTypes.array.isRequired,
		translator: React.PropTypes.func,
		errorFieldRefs: React.PropTypes.shape({ // a Set
			has: React.PropTypes.func
		}),
		children: React.PropTypes.any
	},

	getDefaultProps () {
		return {
			errorFieldRefs: new Set()
		};
	},

	componentDidMount () {
		FieldValuesStore.addChangeListener(this[fieldValueChange]);
	},

	componentWillUnmount () {
		FieldValuesStore.removeChangeListener(this[fieldValueChange]);
	},

	[fieldValueChange] (/* event */) {
		this.forceUpdate();
	},

	componentWillUpdate () {
		this[visibleFields].length = 0;
	},

	componentDidUpdate () {
		let visible = this[getVisibleFieldRefs]();
		FieldValuesStore.setAvailableFields(visible);
	},

	onBlur (event) {
		FieldValuesStore.updateFieldValue(event);
	},

	radioChanged (event) {
		FieldValuesStore.updateFieldValue(event);
	},

	checkboxChanged (event) {
		FieldValuesStore.updateFieldValue(event);
	},

	renderField (field, values) {

		let cssClass = [];
		let tr = this.props.translator || t;
		let type = field.type || 'text';
		let inlineSubfields = null;
		let help = null;

		this[visibleFields].push(field);

		if(field.required) {
			cssClass.push('required');
		}

		if(this.props.errorFieldRefs.has(field.ref)) {
			cssClass.push('error');
		}

		// if (!type || type === 'number') {
		// 	type = 'text';
		// }

		let ref = field.ref;

		// default placeholder for inputs
		let translateOptions = {
			fallback: ''
		};

		let configuredValue = field.type === 'checkbox' ? undefined : (field.value || field.defaultValue);

		// explicit test against undefined because the value could be zero which is falsy.
		if (configuredValue !== undefined && (type === 'hidden' || !FieldValuesStore.getValue(ref))) {
			FieldValuesStore.setValue(ref, configuredValue);
		}

		let props = {
			ref: ref,
			name: ref,
			onBlur: this.onBlur,
			onChange: this.onBlur,
			onFocus: this.props.inputFocus,
			placeholder: field.placeholder || '', // tr(ref, translateOptions),
			className: cssClass.join(' '),
			defaultValue: (values || {})[ref] || FieldValuesStore.getValue(ref) || configuredValue,
			type: type,
			field: field,
			// ToggleFieldset needs to call renderField.
			renderField: this.renderField,
			options: field.options || null,
			// pattern: (field.type === 'number' && '[0-9]*') || null,
			translator: tr
		};

		let input;
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
				props.onChange = this.radioChanged;
				RelatedConfigsStash.concat(this.getRelatedConfigs(field));
				break;

			case 'checkbox':
				input = Checkbox;
				Object.assign(props, {
					onChange: this.checkboxChanged,
					value: field.value,
					checked: (FieldValuesStore.getValue(ref) === field.value)
				});
				break;

			case 'toggleFieldset':
				input = ToggleFieldset;
				break;

			case 'number':
				Object.assign(props, {
					pattern: '[0-9]*',
					inputmode: 'numeric'
				});
				input = 'input';
				break;

			default:
				input = 'input';
		}

		if (typeof field.helptext === 'string' && field.helptext.trim().length > 0) {
			help = React.createElement('div',
				{
					className: 'helptext',
					key: ref.concat('-helptext'),
					dangerouslySetInnerHTML: {__html: field.helptext}
				}
			);
		}

		let component = type === 'label' ?
			React.createElement('label', { ref: ref, className: cssClass.join(' ') }, tr(ref, translateOptions)) :
			React.createElement(input, props);

		if (field.label && !labelIsRenderedByComponent.has(type)) {
			component = React.createElement('label', {},
				React.createElement('span', { className: 'fieldLabel' }, field.label),
				help,
				component
			);
		}

		let subfields = this.renderActiveSubfields(field);

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

	renderActiveSubfields (fieldConfig) {
		let relatedConfigs = this.getRelatedConfigs(fieldConfig);
		let activeInlineSubfields = relatedConfigs.filter(item =>
			item.config[0].type === Constants.SUBFIELDS && item.isActive);

		let values = FieldValuesStore.getValues();
		return activeInlineSubfields.map(item=>
			item.config[0].content.map(field=>
				this.renderField(field, values)
				)
			);
	},

	renderFieldset (fieldset, values, index) {
		let fieldsetComponent = React.createElement('fieldset',
			{
				className: fieldset.className || null,
				key: hash(fieldset)
			},
			!fieldset.title ? null : (<legend>{fieldset.title}</legend>),
			fieldset.fields.map(field=>this.renderField(field, values))
		);

		let related = [];

		RelatedConfigsStash.get().forEach(config => {
			if(config.isActive) {
				// let conf = config.config[0];
				config.config.forEach(conf => {
					switch(conf.type) {
					//TODO: remove all switch statements, replace with functional object literals. No new switch statements.
						case Constants.FORM_CONFIG:
							related.push(this[renderFormConfig](conf.content, values));
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
				});
			}
			// if(config.isActive && config.config[0].type === Constants.FORM_CONFIG) {
			// 	related.push(this[renderFormConfig](config.config[0].content, values));
			// }
		});

		return React.createElement('div',
			{
				className: 'fieldset-'.concat(index),
				key: hash(fieldset)
			},
			fieldsetComponent,
			related
		);
	},

	[renderFormConfig] (config, values) {
		RelatedConfigsStash.clear();
		let args = ['div', {className: 'form-render', key: hash(config)}].concat(
			config.map((fieldset, index)=>this.renderFieldset(fieldset, values, index)));

		return React.createElement.apply(null, args);
	},

	getRelatedConfigs (fieldConfig) {
		let result = [];
		let currentValue = FieldValuesStore.getValue(fieldConfig.ref);
		(fieldConfig.options || []).forEach(option => {
			if(option.related) {
				result.push({
					isActive: currentValue && option.value === currentValue,
					config: option.related
				});
			}
		});
		return result;
	},

	getVisibleFields () {
		return this[visibleFields].slice(0);
	},

	[getVisibleFieldRefs] () {
		return new Set(
			this[visibleFields].map(item => item.ref)
		);
	},

	render () {
		return (
			<div>
				{this[renderFormConfig](this.props.formConfig, FieldValuesStore.getValues())}
				{this.props.children}
			</div>
		);
	}

});

export default RelatedFormPanel;
