import PropTypes from 'prop-types';
import React from 'react';

Subhead.propTypes = {
	entity: PropTypes.object.isRequired
};

export default function Subhead ({entity}) {
	if (!entity || !entity.subhead) {
		return null;
	}

	return (
		<div className="group-subhead">
			<span className="group-subhead-icon" />
			<span className="group-subhead-text">{entity.subhead}</span>
		</div>
	);
}
