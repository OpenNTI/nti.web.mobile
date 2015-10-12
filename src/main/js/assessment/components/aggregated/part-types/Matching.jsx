import React from 'react';

import Toggle from 'common/components/Toggle';

import BarChart from './charts/BarChart';
import TableChart from './charts/TableChart';
import CommonParts from './CommonParts';

export default React.createClass({
	displayName: 'AggregatedMatching',
	mixins: [CommonParts],

	statics: {
		partType: [
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
				<Toggle options={['Table', 'Bar Chart']} active={show} onToggle={this.onToggle}/>

				<Chart data={results}/>
			</div>
		);
	}
});
