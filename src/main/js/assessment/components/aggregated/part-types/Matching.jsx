import React from 'react';

import {BarChart} from 'react-d3-components';

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
