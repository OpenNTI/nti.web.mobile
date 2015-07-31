import React from 'react';
import cx from 'classnames';

export default React.createClass({
	displayName: 'TinyLoader',

	propTypes: {
		className: React.PropTypes.string
	},

	render () {
		return (
			<ul className={cx('tinyloader', this.props.className)}>
				<li /><li /><li />
			</ul>
		);
	}
});
