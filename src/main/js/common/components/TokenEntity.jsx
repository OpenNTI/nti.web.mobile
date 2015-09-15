import React from 'react';
import cx from 'classnames';
import DisplayName from './DisplayName';

export default React.createClass({
	displayName: 'ShareTarget',

	propTypes: {
		className: React.PropTypes.string,
		entity: React.PropTypes.any,
		selected: React.PropTypes.bool
	},

	render () {
		let {className, entity, selected} = this.props;

		return (
			<div className={cx('token pill', className, {selected})} {...this.props}>
				<DisplayName entity={entity}/>
			</div>
		);
	}
});
