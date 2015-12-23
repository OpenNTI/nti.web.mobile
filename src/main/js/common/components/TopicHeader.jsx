import React from 'react';
import cx from 'classnames';

export default React.createClass({
	displayName: 'ListHeader',

	propTypes: {
		className: React.PropTypes.string
	},

	render () {
		const {className} = this.props;

		return (
			<div className={cx('topic-header', className)} {...this.props}/>
		);
	}
});
