import React from 'react';

export default React.createClass({
	displayName: 'SelectBox',

	propTypes: {
		options: React.PropTypes.array.isRequired
	},

	onClick () {

	},

	render () {
		return (
			<ul>
				{this.props.options.map((option, index) => <li key={index} onClick={this.onClick.bind(this, option.value || option.label)}>{option.label}</li>)}
			</ul>
		);
	}
});
