import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import { NavigationStackContext } from '@nti/web-routing';

ReturnTo.propTypes = {
	href: PropTypes.string,
	label: PropTypes.string,
};

export default function ReturnTo({ href, label }) {
	const { pop } = useContext(NavigationStackContext);

	const doPop = e => {
		if (!pop) return;

		e.preventDefault();
		e.stopPropagation();
		pop();
	};

	if (pop) {
		label = 'Back';
	}

	return (
		<a className="return-to" href={href} title={label} onClick={doPop}>
			{label}
		</a>
	);
}
