'use strict';

var React = require('react/addons');

var t = require('common/locale').translate;

var isFunction = require('dataserverinterface/utils/isfunction');
var radiogroup = require('common/forms/components/RadioGroup');
var Select = require('common/forms/components/Select');
var Checkbox = require('common/forms/components/Checkbox');
var ToggleFieldset = require('../components/ToggleFieldset');
var Constants = require('../Constants');
var RelatedFormStore = require('common/forms/RelatedFormStore');

module.exports = {

	// when we're given a translator in renderFormConfig we'll hang onto it
	// so we can use it for rendering related fields and sub-forms.
	_translator: null,

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
		var related = null;

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
			case 'select':
				input = Select;
			break;
			case 'radiogroup':
				input = radiogroup;
				var radioChange = this._radioChanged.bind(null, field);
				var tmp = onChange;
				onChange = tmp ? function(event) { tmp(event); radioChange(event); }.bind(this) : radioChange;
			break;
			case 'checkbox':
				input = Checkbox;
			break;
			case 'toggleFieldset':
				input = ToggleFieldset;
			break;
			default:
				input = React.DOM.input;
		}

		var component = type === 'label' ?
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
				// passing renderField function to custom input components to
				// avoid the circular references that would occur if the
				// component imported this mixin. ToggleFieldset needs this.
				renderField: this.renderField,
				options: field.options||null,
				translator: translator,
				pattern: (field.type === 'number' && '[0-9]*') || null
			});

		var subfields = ((state.subfields||{})[field.ref]||[]).map(function(item) {
			return this.renderField(translator, values, item);
		}.bind(this));

		if (subfields.length > 0) {
			related = React.DOM.div(
				{
					className: 'subfields',
					key: ref.concat('-subfields')
				},
				subfields
			);
		}

		return (
			React.DOM.div(
				{
					key: ref,
					className: ref
				},
				component,
				related
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
		this._translator = translator; // stash for rendering related sub-forms later
		var fieldsets = config.map(function(fieldset, index) {
			return this.renderFieldset(translator, values, fieldset, index);
		}.bind(this));
		return (
			React.DOM.div({className: 'form-render'}, fieldsets)
		);
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
		this._showRelated(fieldConfig, event);
		if(isFunction(this._inputChanged)) {
			this._inputChanged(event);
		}
	},

	_showRelated: function(fieldConfig, event) {
		// find the selected option
		var selectedOption = (fieldConfig.options||[]).find(function(item) {
			return item.value === event.target.value;
		});

		var subfields = this.state.subfields||{};

		if (this.props.storeContextId && subfields[fieldConfig.ref]) {
			//remove these from values store.
			var fieldNames = subfields[fieldConfig.ref].map(item=>item.ref);
			RelatedFormStore.clearValues(this.props.storeContextId, fieldNames);
		}

		delete subfields[fieldConfig.ref];
		var relatedState = {
			relatedForm: [],
			subfields: subfields,
			message: null
		};

		if (selectedOption && Array.isArray(selectedOption.related)) {
			var related = selectedOption.related;
			// related is an array but we currently only support one related item.
			related.forEach(function(item) {
				switch (item.type) {
					case Constants.FORM_CONFIG:
						relatedState.relatedForm = item.content;
					break;

					case Constants.SUBFIELDS:
						// stash subfields in state indexed by field.ref
						// to be rendered as part of this.renderField on
						// the next update.
						relatedState.subfields[fieldConfig.ref] = item.content;
					break;

					case Constants.MESSAGE:
						console.debug('TODO: implement related MESSAGE case for radio option');
						relatedState.message = item.content;
					break;
				}
			}.bind(this));
		}

		this.setState(relatedState);
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
