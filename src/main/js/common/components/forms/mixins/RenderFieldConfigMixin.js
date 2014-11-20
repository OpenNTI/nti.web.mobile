'use strict';

var React = require('react/addons');

var t = require('../../../locale').translate;

var isFunction = require('dataserverinterface/utils/isfunction');

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

		var input;
		switch(field.type) {
			case 'textarea':
				input = React.DOM.textarea;
			break;
			default:
				input = React.DOM.input;
		}

		return (
			React.DOM.div(
				{
					key: ref
				},
				input({
					ref: ref,
					value: (values||{}).ref,
					name: ref,
					onBlur: this._onBlur,
					onFocus: this._onFocus,
					placeholder: tr(ref,translateOptions),
					className: cssClass.join(' '),
					defaultValue: (values||{})[ref],
					type: type,
					pattern: field.type === 'number' && '[0-9]*'
				})
			)
		);
	},

	renderFieldset: function(translator, values, fieldset, index) {

		var fieldRenderFn = this.renderField.bind(null, translator, values);
		var fields = fieldset.fields.map(fieldRenderFn);
		var legend = React.DOM.legend({key: 'legend'}, fieldset.title);

		var key = 'fieldset-'.concat(index);
		return React.DOM.fieldset({key: key}, [legend, fields]);
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

		if (isFunction(this._inputBlurred)) {
			this._inputBlurred(event);
		}
	}

};
