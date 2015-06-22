import React from 'react';

export default React.createClass({
	displayName: 'GradientBackground',

	propTypes: {
		children: React.PropTypes.any,
		className: React.PropTypes.any
	},

	render () {
		let {classSet} = React.addons;
		let classes = classSet(
			'gradient-bg',
			this.props.className
		);

		return (
			<div {...this.props} className={classes} >
				{this.props.children}
			</div>
		);
	}
});
