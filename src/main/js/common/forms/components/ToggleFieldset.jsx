/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var isFunction = require('dataserverinterface/utils/isfunction');

var ToggleFieldset = React.createClass({

	propTypes: {
		field: React.PropTypes.object.isRequired,
		renderField: React.PropTypes.func.isRequired,
		translator: React.PropTypes.func.isRequired
	},

	getInitialState: function() {
		//FIXME: Re-write this:
		// See: http://facebook.github.io/react/tips/props-in-getInitialState-as-anti-pattern.html
		// Additional Node: On Mount and Recieve Props fill state (this is ment to be called one per CLASS lifetime not Instance lifetime)
		
		return {
			fieldset: this.props.field.fieldsetOff,
			fieldValues: {}
		};
	},

	_onToggle: function(event) {
		var config = this.props.field;
		var fs = event.target.checked ? config.fieldsetOn : config.fieldsetOff;
		this.setState({
			fieldset: fs
		});
		if(isFunction(this.props.onChange)) {
			this.props.onChange(event);
		}
	},

	render: function() {

		var fieldset = this.state.fieldset;
		var fields = (fieldset||{}).fields||[];
		var displayFields = fields.map(function(field) {
			return this.props.renderField(field, this.state.fieldValues);
		}.bind(this));

		// this.state.fieldset ? this.props.renderFieldset(this.props.translator, this.state.fieldValues, this.state.fieldset) : null;
		var config = this.props.field;
		var ref = config.ref;

		return (
			<div>
				<label><input type="checkbox" name={ref} ref={ref} onChange={this._onToggle} /><span>{config.label}</span></label>
				{displayFields}
			</div>
		);
	}

});

module.exports = ToggleFieldset;
