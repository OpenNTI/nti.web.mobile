import React from 'react';

import BarChart from './charts/BarChart';
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
		const {state: {results}} = this;

		return (
			<div>
				<BarChart data={results}/>
			</div>
		);
	}
});
