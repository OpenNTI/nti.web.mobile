import React from 'react';

export default React.createClass({
	displayName: 'Profile:Card',

	propTypes: {
		title: React.PropTypes.string,
		className: React.PropTypes.string,
		children: React.PropTypes.any
	},

	render () {
		return (
			<li className={'profile-card ' + this.props.className}>
				{this.props.title && <h1>{this.props.title}</h1>}
				<div>
					{this.props.children}
				</div>
			</li>
		);
	}
});
