import React from 'react';

import CommonParts from './CommonParts';

export default React.createClass({
	displayName: 'AggregatedOrdering',
	mixins: [CommonParts],

	statics: {
		partType: [
			'Ordering'
		]
	},

	render () {
		return (
			<div>
				Ordering
			</div>
		);
	}
});
