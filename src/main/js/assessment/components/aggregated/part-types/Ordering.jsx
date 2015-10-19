import React from 'react';

import Toggle from 'common/components/Toggle';

import BarChart from './charts/BarChart';
import TableChart from './charts/TableChart';
import CommonParts from './CommonParts';

export default React.createClass({
	displayName: 'AggregatedOrdering',
	mixins: [CommonParts],

	statics: {
		partType: [
			'Ordering',
			'Matching'
		]
	},


	onToggle (newActive) {
		this.setState({show: newActive});
	},


	render () {
		const {state: {results, show}} = this;

		const Chart = show === 'Table' ? TableChart : BarChart;

		return (
			<div>
				<Toggle options={['Table', 'Bar Chart']} active={show || 'Bar Chart'} onToggle={this.onToggle}/>

				<Chart data={results}/>
			</div>
		);
	}
});
