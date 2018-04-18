import PropTypes from 'prop-types';
import React from 'react';
import {Ellipsed} from '@nti/web-commons';

Description.propTypes = {
	entity: PropTypes.object.isRequired
};

export default function Description ({entity}) {
	if (!entity || !entity.description) {
		return null;
	}

	return (
		<Ellipsed className="description">{entity.description}</Ellipsed>
	);
}
