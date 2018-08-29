import PropTypes from 'prop-types';
import React from 'react';

const isFunction = f => typeof f === 'function';

const onToggle = 'ToggleFieldset:onToggle';

export default class extends React.Component {
	static displayName = 'forms:ToggleFieldset';

	static propTypes = {
		field: PropTypes.object.isRequired,
		renderField: PropTypes.func.isRequired,
		translator: PropTypes.func.isRequired,
		onChange: PropTypes.func
	};

	state = {
		fieldset: this.props.field.fieldsetOff,
		fieldValues: {}
	}

	onToggle = (event) => {
		let config = this.props.field;
		let fs = event.target.checked ? config.fieldsetOn : config.fieldsetOff;
		this.setState({
			fieldset: fs
		});
		if(isFunction(this.props.onChange)) {
			this.props.onChange(event);
		}
	};

	render () {

		let fieldset = this.state.fieldset;
		let fields = (fieldset || {}).fields || [];
		let displayFields = fields.map(field =>
			this.props.renderField(field, this.state.fieldValues));

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
}
