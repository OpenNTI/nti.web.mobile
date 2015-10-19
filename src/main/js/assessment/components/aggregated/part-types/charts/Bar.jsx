import React from 'react';

import If from 'common/components/Conditional';

import Segment from './BarSegment';

export default React.createClass({
	displayName: 'Bar',

	propTypes: {
		colors: React.PropTypes.object,
		label: React.PropTypes.string,
		labelPrefix: React.PropTypes.string,
		series: React.PropTypes.arrayOf(React.PropTypes.shape({
			label: React.PropTypes.string,
			count: React.PropTypes.number,
			percent: React.PropTypes.number.isRequired
		}))
	},

	render () {
		const {props: {colors, label, labelPrefix, series}} = this;

		return (
			<div className="bar">
				<div className="axis-label">
					<If tag="strong" condition={!!labelPrefix}>
						{labelPrefix}
					</If>
					{label}
				</div>
				<div className="bar-series">
					{series.map((x, i) =>
						<Segment key={i} colors={colors} {...x}/>
					)}
				</div>
			</div>
		);
	}
});
