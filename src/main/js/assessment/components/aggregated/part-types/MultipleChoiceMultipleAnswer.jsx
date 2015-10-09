import React from 'react';

import BarChart from './charts/BarChart';
import CommonParts from './CommonParts';

export default React.createClass({
	displayName: 'AggregatedMultipleChoiceMultipleAnswer',
	mixins: [CommonParts],

	statics: {
		partType: [
			'MultipleChoiceMultipleAnswer'
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
