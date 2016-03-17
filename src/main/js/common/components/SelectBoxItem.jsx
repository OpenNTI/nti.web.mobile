import React from 'react';

export default React.createClass({
	displayName: 'SelectBoxItem',

	propTypes: {
		option: React.PropTypes.shape({
			label: React.PropTypes.string,
			value: React.PropTypes.any
		}),
		onClick: React.PropTypes.func
	},

	onClick () {
		const {option, onClick} = this.props;
		onClick && onClick(option.value || option.label);
	},

	render () {
		const {option} = this.props;

		return (
			<li onClick={this.onClick}><span className="option-label">{option.label}</span></li>
		);
	}
});
