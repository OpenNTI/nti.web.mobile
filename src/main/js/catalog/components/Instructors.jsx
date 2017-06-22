import PropTypes from 'prop-types';
import React from 'react';

import Instructor from './Instructor';

export default function Instructors ({entry}) {
	let instructors = ((entry || {}).Instructors) || [];
	let root = '/no-root/';

	if (entry) {
		root = entry.getAssetRoot() || root;
	}

	return (
		<div className="course-instructors">
			{instructors.map((i, index) =>
				<Instructor key={i.Name} index={index} assetRoot={root} instructor={i}/>
			)}
		</div>
	);
}

Instructors.propTypes = {
	entry: PropTypes.object.isRequired
};
