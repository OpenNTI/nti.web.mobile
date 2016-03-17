import React from 'react';
import cx from 'classnames';
import DisplayName from './DisplayName';

export default function ShareTarget (props) {
	let {className, entity, selected} = props;

	return (
		<div className={cx('token pill', className, {selected})} {...props}>
			<DisplayName entity={entity} suppressProfileLink/>
		</div>
	);
}

ShareTarget.propTypes = {
	className: React.PropTypes.string,
	entity: React.PropTypes.any,
	selected: React.PropTypes.bool
};
