import React from 'react';
import cx from 'classnames';

export default React.createClass({
	displayName: 'TokenTag',

	propTypes: {
		className: React.PropTypes.string,

		selected: React.PropTypes.bool,

		name: React.PropTypes.string,

		value: React.PropTypes.string.isRequired
	},

	render () {
		let {className, selected, name, value} = this.props;

		return (
			<div data-value={value} className={cx('token', className, {selected})} {...this.props}>
				{name || value}
			</div>
		);
	}
});
