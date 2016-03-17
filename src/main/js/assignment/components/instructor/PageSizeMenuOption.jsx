import React from 'react';

export default React.createClass({
	displayName: 'PageSizeMenuOption',

	propTypes: {
		value: React.PropTypes.string,
		onClick: React.PropTypes.func,
		className: React.PropTypes.any
	},

	onClick () {
		const {value, onClick} = this.props;
		onClick && onClick(value);
	},

	render () {

		const {value, className} = this.props;

		return (
			<li className={className} onClick={this.onClick}>
				{`${value} students per page`}
			</li>
		);
	}
});
