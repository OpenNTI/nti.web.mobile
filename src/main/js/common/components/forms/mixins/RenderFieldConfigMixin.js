'use strict';

var React = require('react/addons');

var t = require('../../../locale').translate;

var isFunction = require('dataserverinterface/utils/isfunction');
var guid = require('dataserverinterface/utils/guid');

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

		if(field.required) {
			cssClass.push('required');
		}

		var ref = field.ref;

		// default placeholder for inputs
		var translateOptions = {
			fallback: ''
		};

		return (
			React.DOM.div(
				{
					key: ref
				},
				React.DOM.input({
					ref: ref,
					value: (values||{}).ref,
					name: ref,
					onBlur: this._onBlur,
					onFocus: this._onFocus,
					placeholder: tr(ref,translateOptions),
					className: cssClass.join(' '),
					defaultValue: (values||{})[ref],
					type: (field.type||'text')
				})
			)
		);
	},

	renderFieldset: function(translator, values, fieldset) {

		var fieldRenderFn = this.renderField.bind(null, translator, values);
		var fields = fieldset.fields.map(fieldRenderFn);
		var legend = React.DOM.legend({key: 'legend'}, fieldset.title);

		var key = 'fieldset-'.concat(guid());
		return React.DOM.fieldset({key: key}, [legend, fields]);
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
