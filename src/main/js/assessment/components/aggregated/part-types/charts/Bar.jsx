import React from 'react';
import Segment from './BarSegment';
import {rawContent} from 'nti-commons/lib/jsx';

Bar.propTypes = {
	colors: React.PropTypes.object,
	label: React.PropTypes.string,
	labelPrefix: React.PropTypes.string,
	series: React.PropTypes.arrayOf(React.PropTypes.shape({
		label: React.PropTypes.string,
		count: React.PropTypes.number,
		percent: React.PropTypes.number.isRequired
	}))
};

export default function Bar ({colors, label, labelPrefix, series}) {
	return (
		<div className="bar">
			<div className="axis-label">
				{!!labelPrefix && ( <strong>{labelPrefix}</strong> )}
				<span {...rawContent(label)}/>
			</div>
			<div className="bar-series">
				{series.map((x, i) =>
					<Segment key={i} colors={colors} {...x}/>
				)}
			</div>
		</div>
	);
}
