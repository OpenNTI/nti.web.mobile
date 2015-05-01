

import React from 'react';
import isFunction from 'nti.lib.interfaces/utils/isfunction';

const onToggle = 'ToggleFieldset:onToggle';

export default React.createClass({

	displayName: 'forms:ToggleFieldset',

	propTypes: {
		field: React.PropTypes.object.isRequired,
		renderField: React.PropTypes.func.isRequired,
		translator: React.PropTypes.func.isRequired,
		onChange: React.PropTypes.func
	},

	getInitialState: function() {
		//FIXME: Re-write this:
		// See: http://facebook.github.io/react/tips/props-in-getInitialState-as-anti-pattern.html
		// Additional Note: On Mount and Recieve Props fill state (this is ment to be called one per CLASS lifetime not Instance lifetime)

		return {
			fieldset: this.props.field.fieldsetOff,
			fieldValues: {}
		};
	},

	[onToggle]: function(event) {
		let config = this.props.field;
		let fs = event.target.checked ? config.fieldsetOn : config.fieldsetOff;
		this.setState({
			fieldset: fs
		});
		if(isFunction(this.props.onChange)) {
			this.props.onChange(event);
		}
	},

	render: function() {

		let fieldset = this.state.fieldset;
		let fields = (fieldset || {}).fields || [];
		let displayFields = fields.map(function(field) {
			return this.props.renderField(field, this.state.fieldValues);
		}.bind(this));

		// this.state.fieldset ? this.props.renderFieldset(this.props.translator, this.state.fieldValues, this.state.fieldset) : null;
		let config = this.props.field;
		let ref = config.ref;

		return (
			<div>
				<label>
					<input type="checkbox" name={ref} ref={ref} onChange={this[onToggle]} />
					<span>{config.label}</span>
				</label>
				{displayFields}
			</div>
		);
	}

});
