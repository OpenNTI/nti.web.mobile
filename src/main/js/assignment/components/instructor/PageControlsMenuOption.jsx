import React from 'react';

export default React.createClass({
	displayName: 'PageControlsMenuOption',

	propTypes: {
		onClick: React.PropTypes.func,
		page: React.PropTypes.number,
		className: React.PropTypes.any,
		children: React.PropTypes.any
	},

	onClick () {
		const {onClick, page} = this.props;
		onClick && onClick(page);
	},

	render () {

		const {className, children} = this.props;

		return (
			<li className={className} onClick={this.onClick}>
				{children}
			</li>
		);
	}
});
