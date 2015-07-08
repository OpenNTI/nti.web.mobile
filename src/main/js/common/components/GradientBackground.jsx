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
		let {className, imgUrl} = this.props;
		let style = imgUrl ? {
			backgroundImage: 'url(' + imgUrl + ')',
			backgroundSize: 'cover'
		} : {};
		return (
			<div {...this.props} style={style} className={cx('gradient-bg', className)} />
		);
	}
});
