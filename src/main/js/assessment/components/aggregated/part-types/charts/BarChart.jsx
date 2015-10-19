import React from 'react';

import Color from 'nti.lib.whiteboardjs/lib/Color';

import Bar from './Bar';
import Legend from './Legend';

function concatUnique (list, toappend) {
	const newItems = toappend.filter(x => list.indexOf(x) === -1);
	if (newItems.length > 0) {
		list = [...list, ...newItems];
	}
	return list;
}

export default React.createClass({
	displayName: 'BarChart',

	propTypes: {
		data: React.PropTypes.arrayOf(
			React.PropTypes.shape({
				label: React.PropTypes.string.isRequired,
				labelPrefix: React.PropTypes.string,
				series: React.PropTypes.arrayOf(
					React.PropTypes.shape({
						label: React.PropTypes.string,
						count: React.PropTypes.number,
						percent: React.PropTypes.number.isRequired
					}))
			}))
	},

	render () {
		const {props: {data}} = this;
		const legendItems = data.reduce((a, x) => concatUnique(a, x.series.map(s => s.label)), []);

		const colors = {};
		legendItems.forEach((name, ix) =>
			colors[name] = Color.getColor(ix).toString());

		return (
			<div className="bar-chart">
				<div className="scene">
					{data.map((x)=>
						<Bar key={x.label} colors={colors} {...x}/>
					)}
				</div>
				<Legend items={legendItems} colors={colors}/>
			</div>
		);
	}
});
