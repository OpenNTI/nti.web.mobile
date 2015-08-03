import React from 'react';

import isFunction from 'nti.lib.interfaces/utils/isfunction';
import radiogroup from 'common/forms/components/RadioGroup';
import Select from 'common/forms/components/Select';
import Checkbox from 'common/forms/components/Checkbox';
import ToggleFieldset from '../components/ToggleFieldset';

import t from 'common/locale';
import {RENDERED_FORM_EVENT_HANDLERS as Events} from '../Constants';

const prefix = 'RenderFormConfig:';
const stashedTranslator = prefix + 'translator';

/** Constants for private methods **/
const blurhandler = prefix + 'onblur';
const focushandler = prefix + 'onfocus';
const radiochangehandler = prefix + 'radiochange';

const inputMap = {
	'checkbox': Checkbox,
	'radiogroup': radiogroup,
	'select': Select,
	'textarea': 'textarea',
	'toggleFieldset': ToggleFieldset
};

export default {

	// when we're given a translator in renderFormConfig we'll hang onto it
	// so we can use it for rendering related fields and sub-forms.
	[stashedTranslator]: null,

	/**
	 * Renders an html form field from a config object.
	 * @param {function} translator localization function for placeholders.
	 * @param {object} values field values indexed by field.ref
	 * @param {object} field field config, e.g.
	 *	{
	 *		ref: 'name',
	 *		type: 'text',
	 *		required: true,
	 *		placeholder: 'Your Name'
	 *	}
	 *
	 * @return {ReactElement} The Rendered Field
	 */
	renderField (translator, values, field) {

		let state = this.state;
		let err = (state.errors || {})[field.ref];
		let cssClass = err ? ['error'] : [];
		let tr = translator || t;
		let type = field.type;
		let related = null;

		if(field.required) {
			cssClass.push('required');
		}

		if (!type || type === 'number') {
			type = 'text';
		}

		let ref = field.ref;

		// default placeholder for inputs
		let translateOptions = {
			fallback: ''
		};

		let onChange = isFunction(this[Events.ON_CHANGE]) ? this[Events.ON_CHANGE] : null;

		let input = inputMap[field.type] || 'input';

		if (field.type === 'radiogroup') {
			let radioChange = this[radiochangehandler].bind(null, field);
			let tmp = onChange;
			onChange = tmp ? function (event) { tmp(event); radioChange(event); } : radioChange;
		}

		let component = type === 'label' ?
			React.createElement('label', {ref: ref, className: cssClass.join(' ') }, tr(ref, translateOptions)) :
			React.createElement(input, {
				ref: ref,
				//value: (values||{})[ref],
				name: ref,
				onBlur: this[blurhandler],
				onFocus: this[focushandler],
				onChange: onChange,
				placeholder: tr(ref, translateOptions),
				className: cssClass.join(' '),
				defaultValue: (values || {})[ref],
				type: type,
				field: field,
				// passing renderField function to custom input components to
				// avoid the circular references that would occur if the
				// component imported this mixin. ToggleFieldset needs this.
				renderField: this.renderField,
				options: field.options || null,
				translator: translator,
				pattern: (field.type === 'number' && '[0-9]*') || null
			});

		let subfields = ((state.subfields || {})[field.ref] || []).map(
			item=>this.renderField(translator, values, item)
		);

		if (subfields.length > 0) {
			related = React.createElement('div',
				{
					className: 'subfields',
					key: ref.concat('-subfields')
				},
				subfields
			);
		}

		return (
			React.createElement('div',
				{
					key: ref,
					className: ref
				},
				component,
				related
			)
		);
	},

	renderFieldset (translator, values, fieldset, index) {

		let fieldRenderFn = this.renderField.bind(null, translator, values);

		let key = 'fieldset-'.concat(index);
		return React.createElement('fieldset',
			{
				key: key,
				className: fieldset.className || null
			},
			fieldset.title ? React.createElement('legend', {}, fieldset.title) : null,
			fieldset.fields.map(fieldRenderFn)
		);
	},

	renderFormConfig (config, values, translator) {
		this[stashedTranslator] = translator; // stash for rendering related sub-forms later
		let args = ['div', {className: 'form-render'}].concat(
			config.map(
				(fieldset, index)=>this.renderFieldset(translator, values, fieldset, index)
			)
		);
		return React.createElement.apply(null, args);
	},

	[focushandler] (event) {
		let target = event.target.name;
		let errors = this.state.errors || {};
		if (errors[target]) {
			delete errors[target];
			this.forceUpdate();
		}
		if (isFunction(this[Events.ON_FOCUS])) {
			this[Events.ON_FOCUS](event);
		}
	},

	[blurhandler] (event) {
		this.updateFieldValueState(event);
		if (isFunction(this[Events.ON_BLUR])) {
			this[Events.ON_BLUR](event);
		}
	},

	[radiochangehandler] (fieldConfig, event) {
		this.updateFieldValueState(event);
		if(isFunction(this[Events.ON_CHANGE])) {
			this[Events.ON_CHANGE](event);
		}
	},

	updateFieldValueState (event) {
		let target = event.target;
		let field = target.name;
		let value = target.value;
		let tmp = Object.assign({}, this.state.fieldValues);

		if (value || tmp.hasOwnProperty(field)) {
			// don't set an empty value if there's not already
			// an entry for this field in this.state.fieldValues
			tmp[field] = value;
			this.setState({ fieldValues: tmp });
		}
	},

	addFormatters () {
		let i;
		let ref;
		let format;
		let formatters = this.inputFormatters;

		if (formatters) {
			for (i in formatters) {
				if (formatters.hasOwnProperty(i)) {
					ref = this.refs[i];

					if (!ref || !ref.isMounted()) { continue; }

					format = formatters[i];

					if (isFunction(format)) {
						format(React.findDOMNode(ref));
					}
				}
			}
		}
	}

};
