'use strict';

var React = require('react/addons');

var t = require('../../../locale').translate;

var isFunction = require('dataserverinterface/utils/isfunction');
var radiogroup = require('common/components/forms/mixins/RadioGroup');

module.exports = {

	/**
	* Renders an html form field from a config object.
	* @param translator: localization function for placeholders.
	* @param values: field values indexed by field.ref
	* @param field: field config, e.g.
	*	{
	*		ref: 'name',
	*		type: 'text',
	*		required: true,
	*		placeholder: 'Your Name'
	*	}
	*/
	renderField: function(translator, values, field) {
		var state = this.state;
		var err = (state.errors||{})[field.ref];
		var cssClass = err ? ['error'] : [];
		var tr = translator||t;
		var type = field.type;

		if(field.required) {
			cssClass.push('required');
		}

		if (!type || type === 'number') {
			type = 'text';
		}

		var ref = field.ref;

		// default placeholder for inputs
		var translateOptions = {
			fallback: ''
		};

		var onChange = isFunction(this._inputChanged) ? this._inputChanged : null;

		var input;
		switch(field.type) {
			case 'textarea':
				input = React.DOM.textarea;
			break;
			case 'radiogroup':
				input = radiogroup;
				onChange = this._radioChanged.bind(null, field);
			break;
			default:
				input = React.DOM.input;
		}

		return (
			React.DOM.div(
				{
					key: ref,
					className: ref
				},

				type === 'label' ?
					React.DOM.label({ ref: ref, className: cssClass.join(' ') }, tr(ref, translateOptions)) :
					input({
						ref: ref,
						value: (values||{}).ref,
						name: ref,
						onBlur: this._onBlur,
						onFocus: this._onFocus,
						onChange: onChange,
						placeholder: tr(ref,translateOptions),
						className: cssClass.join(' '),
						defaultValue: (values||{})[ref],
						type: type,
						field: field,
						options: field.options||null,
						pattern: (field.type === 'number' && '[0-9]*') || null
					})
			)
		);
	},

	renderFieldset: function(translator, values, fieldset, index) {

		var fieldRenderFn = this.renderField.bind(null, translator, values);

		var key = 'fieldset-'.concat(index);
		return React.DOM.fieldset({key: key, className: fieldset.className || null}, [
			fieldset.title ? React.DOM.legend({key: key+'-legend'}, fieldset.title) : null,
			fieldset.fields.map(fieldRenderFn)
			]);
	},

	renderFormConfig: function(config, values, translator) {
		return config.map(function(fieldset, index) {
			return this.renderFieldset(translator, values, fieldset, index);
		}.bind(this));
	},

    _onFocus: function(event) {
		var target = event.target.name;
		var errors = this.state.errors||{};
		if (errors[target]) {
			delete errors[target];
			this.forceUpdate();
		}
		if (isFunction(this._inputFocused)) {
			this._inputFocused(event);
		}
	},

	_onBlur: function(event) {
		this.updateFieldValueState(event);
		if (isFunction(this._inputBlurred)) {
			this._inputBlurred(event);
		}
	},

	_radioChanged: function(fieldConfig, event) {
		this.updateFieldValueState(event);
		var selectedOption = (fieldConfig.options||[]).find(function(item) {
			return item.value === event.target.value;
		})
		if (selectedOption && Array.isArray(selectedOption.related)) {
			console.debug('selected option has related options. %O', selectedOption);
			// can we do something with state to keep track of the related fields/forms/messages?
			// if we manage this manually we'll have to manage the removal of the option that's
			// being de-selected too.
			// this.state.related = { field.ref: selectedOption.related }
		}
		if(isFunction(this._inputChanged)) {
			this._inputChanged(event);
		}
	},

	updateFieldValueState: function(event) {
		var target = event.target;
		var field = target.name;
		var value = target.value;
		var tmp = Object.assign({}, this.state.fieldValues);

		if (value || tmp.hasOwnProperty(field)) {
			// don't set an empty value if there's not already
			// an entry for this field in this.state.fieldValues
			tmp[field] = value;
			this.setState({ fieldValues: tmp });
		}
	},

	addFormatters: function() {
		var i;
		var ref;
		var format;
		var formatters = this.inputFormatters;

		if (formatters) {
			for (i in formatters) {
				if (formatters.hasOwnProperty(i)) {
					ref = this.refs[i];

					if (!ref || !ref.isMounted()) { continue; }

					format = formatters[i];

					if (isFunction(format)) {
						format(ref.getDOMNode());
					}
				}
			}
		}
	}

};
