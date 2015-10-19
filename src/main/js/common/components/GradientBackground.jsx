import React from 'react';

import cx from 'classnames';

export default React.createClass({
	displayName: 'GradientBackground',

	propTypes: {
		className: React.PropTypes.any,
		imgUrl: React.PropTypes.string,
		children: React.PropTypes.any
	},

	render () {
		let {className, imgUrl, children} = this.props;
		return (
			<div {...this.props} className={cx('gradient-bg', className)}>
				{imgUrl && <img src={imgUrl} className="gradient-bg-img"/>}
				{children}
			</div>
		);
	}
});
