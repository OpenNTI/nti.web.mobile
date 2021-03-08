import './Bar.scss';
import React from 'react';
import PropTypes from 'prop-types';

import { rawContent } from '@nti/lib-commons';

import Segment from './BarSegment';

Bar.propTypes = {
	colors: PropTypes.object,
	label: PropTypes.string,
	labelPrefix: PropTypes.string,
	series: PropTypes.arrayOf(
		PropTypes.shape({
			label: PropTypes.string,
			count: PropTypes.number,
			percent: PropTypes.number.isRequired,
		})
	),
};

export default function Bar({ colors, label, labelPrefix, series }) {
	return (
		<div className="bar">
			<div className="axis-label">
				{!!labelPrefix && <strong>{labelPrefix}</strong>}
				<span {...rawContent(label)} />
			</div>
			<div className="bar-series">
				{series.map((x, i) => (
					<Segment key={i} colors={colors} {...x} />
				))}
			</div>
		</div>
	);
}
