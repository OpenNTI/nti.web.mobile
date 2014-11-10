'use strict';

var assign = Object.assign || require('object-assign');

var React = require('react/addons');
var t = require('common/locale').translate;

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
		var err = state.errors[field.ref];
		var cssClass = err ? 'error' : null;
		var tr = translator||t;

		return (
			React.DOM.div(
				{
					key: field.ref
				},
				React.DOM.input({
					ref: field.ref,
					value: (values||{}).ref,
					name: field.ref,
					onBlur: this._inputBlurred,
					onFocus: this._inputFocused,
					placeholder: tr(field.ref),
					className: cssClass,
					defaultValue: (values||{}).ref,
					type: field.type
				})
			)
		);
	}

};
