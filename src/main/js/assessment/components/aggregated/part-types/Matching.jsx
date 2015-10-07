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

		let data = [
			{
				label: 'somethingA',
				values: [
					{x: 'SomethingA', y: 10},
					{x: 'SomethingB', y: 4},
					{x: 'SomethingC', y: 3}
				]
			},
			{
				label: 'somethingB',
				values: [
					{x: 'SomethingA', y: 6},
					{x: 'SomethingB', y: 8},
					{x: 'SomethingC', y: 5}
				]
			},
			{
				label: 'somethingC',
				values: [
					{x: 'SomethingA', y: 6},
					{x: 'SomethingB', y: 8},
					{x: 'SomethingC', y: 5}
				]
			}
		];

		const tooltip = (x, y0, y/*, total*/) => y.toString();




		return (
			<div>
			<BarChart
				data={data}
				width={400}
				height={400}
				margin={{top: 10, bottom: 50, left: 50, right: 10}}
				tooltipHtml={tooltip}
				tooltipMode={'element'}
				/>
			</div>
		);
	}
});
