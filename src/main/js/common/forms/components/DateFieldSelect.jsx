import React from 'react';

export default React.createClass({
	displayName: 'DateFieldSelect',

	propTypes: {
		children: React.PropTypes.any,
		onChange: React.PropTypes.func,
		name: React.PropTypes.string
	},

	handleChange (event) {
		const {onChange, name} = this.props;
		const {value} = event.target;
		if (onChange) {
			onChange({ name, value });
		}
	},

	render () {
		return (
			<select {...this.props} onChange={this.handleChange}>
				{this.props.children}
			</select>
		);
	}
});
