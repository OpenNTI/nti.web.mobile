import React from 'react';

import BarChart from './charts/BarChart';
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
		const {state: {results}} = this;

		return (
			<div>
				<BarChart data={results}/>
			</div>
		);
	}
});
