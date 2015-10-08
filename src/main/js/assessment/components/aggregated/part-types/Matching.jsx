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

	propTypes: {
		item: React.PropTypes.object,
		questionPart: React.PropTypes.object
	},

	render () {
		const {props: {item, questionPart}} = this;

		console.log(item.Results, questionPart);

		let data = [
			{
				label: 'fieldA',
				values: [
					{x: 'CategoryA', y: 10},
					{x: 'CategoryB', y: 4},
					{x: 'CategoryC', y: 3}
				]
			},
			{
				label: 'fieldB',
				values: [
					{x: 'CategoryA', y: 6},
					{x: 'CategoryB', y: 8},
					{x: 'CategoryC', y: 5}
				]
			},
			{
				label: 'fieldC',
				values: [
					{x: 'CategoryA', y: 6},
					{x: 'CategoryB', y: 8},
					{x: 'CategoryC', y: 5}
				]
			}
		];

		const tooltip = (x, y0, y/*, total*/) => x + y0 + (y.toString());




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
