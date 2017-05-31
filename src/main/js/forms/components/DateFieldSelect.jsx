import PropTypes from 'prop-types';
import React from 'react';

export default class extends React.Component {
	static displayName = 'DateFieldSelect';

	static propTypes = {
		children: PropTypes.any,
		onChange: PropTypes.func,
		name: PropTypes.string
	};

	handleChange = (event) => {
		const {onChange, name} = this.props;
		const {value} = event.target;
		if (onChange) {
			onChange({ name, value });
		}
	};

	render () {
		return (
			<select {...this.props} onChange={this.handleChange}>
				{this.props.children}
			</select>
		);
	}
}
