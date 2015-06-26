import React from 'react';

import cx from 'classnames';

export default React.createClass({
	displayName: 'GradientBackground',

	propTypes: {
		className: React.PropTypes.any
	},

	render () {
		let {className} = this.props;
		return (
			<div {...this.props} className={cx('gradient-bg', className)}/>
		);
	}
});
