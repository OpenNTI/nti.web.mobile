import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';
import DisplayName from './DisplayName';

ShareTarget.propTypes = {
	className: PropTypes.string,
	entity: PropTypes.any,
	selected: PropTypes.bool
};

export default function ShareTarget ({className, entity, selected, ...props}) {

	return (
		<div className={cx('token pill', className, {selected})} {...props}>
			<DisplayName entity={entity} suppressProfileLink/>
		</div>
	);
}
