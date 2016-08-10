import React from 'react';
import {Ellipsed} from 'nti-web-commons';

Description.propTypes = {
	entity: React.PropTypes.object.isRequired
};

export default function Description ({entity}) {
	if (!entity || !entity.description) {
		return null;
	}

	return (
		<Ellipsed className="description">{entity.description}</Ellipsed>
	);
}
