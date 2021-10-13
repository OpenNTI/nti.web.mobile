import PropTypes from 'prop-types';

import { Color } from '@nti/lib-whiteboard';

import Bar from './Bar';
import Legend from './Legend';

function concatUnique(list, toappend) {
	const newItems = toappend.filter(x => list.indexOf(x) === -1);
	if (newItems.length > 0) {
		list = [...list, ...newItems];
	}
	return list;
}

BarChart.propTypes = {
	data: PropTypes.arrayOf(
		PropTypes.shape({
			label: PropTypes.string.isRequired,
			labelPrefix: PropTypes.string,
			series: PropTypes.arrayOf(
				PropTypes.shape({
					label: PropTypes.string,
					count: PropTypes.number,
					percent: PropTypes.number.isRequired,
				})
			),
		})
	),
};

export default function BarChart({ data }) {
	const legendItems = data.reduce(
		(a, x) =>
			concatUnique(
				a,
				x.series.map(s => s.label)
			),
		[]
	);

	const colors = {};
	legendItems.forEach(
		(name, ix) => (colors[name] = Color.getColor(ix).toString())
	);

	return (
		<div className="bar-chart">
			<div className="scene">
				{data.map(x => (
					<Bar key={x.label} colors={colors} {...x} />
				))}
			</div>
			<Legend items={legendItems} colors={colors} />
		</div>
	);
}
