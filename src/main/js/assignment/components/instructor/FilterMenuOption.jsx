import React from 'react';

export default React.createClass({
	displayName: 'FilterMenuOption',

	propTypes: {
		onClick: React.PropTypes.func,
		option: React.PropTypes.any,
		className: React.PropTypes.any
	},

	onClick () {
		const {onClick, option} = this.props;
		onClick && onClick(option);
	},

	render () {

		const {option, className} = this.props;

		return (
			<li key={option.value}
				className={className}
				onClick={this.onClick}>
				{option.label}
			</li>
		);
	}
});