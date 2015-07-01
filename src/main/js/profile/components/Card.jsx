import React from 'react';

export default React.createClass({
	displayName: 'Profile:Card',

	propTypes: {
		title: React.PropTypes.string,
		className: React.PropTypes.string,
		children: React.PropTypes.any
	},

	render () {
		let {children, className, title} = this.props;
		return (
			<li className={'profile-card ' + className}>
				{title && <h1>{title}</h1>}
				{children}
			</li>
		);
	}
});
