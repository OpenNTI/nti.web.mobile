import React from 'react';

export default React.createClass({
	displayName: 'MultiTextItem',

	propTypes: {
		element: React.PropTypes.object,
		index: React.PropTypes.number,
		value: React.PropTypes.string,
		onChange: React.PropTypes.func
	},

	onChange (e) {
		this.props.onChange(this.props.index, e.target.value);
	},

	render () {

		const {element, index, value} = this.props;

		return (
			<input type="text"
				name={`${element.name}[]`}
				initialValue={value}
				onChange={this.onChange}
			/>
		);
	}
});
