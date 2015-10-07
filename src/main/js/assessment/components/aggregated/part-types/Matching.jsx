import React from 'react';

import CommonParts from './CommonParts';

export default React.createClass({
	displayName: 'AggregatedMatching',
	mixins: [CommonParts],

	statics: {
		partType: [
			'Matching'
		]
	},

	render () {
		return (
			<div>
				Matching
			</div>
		);
	}
});
