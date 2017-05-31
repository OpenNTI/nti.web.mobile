import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';
import {rawContent} from 'nti-commons';

export default class extends React.Component {
	static displayName = 'BarSegment';

	static propTypes = {
		colors: PropTypes.object,
		label: PropTypes.string,
		count: PropTypes.number,
		percent: PropTypes.number,
		total: PropTypes.number
	};

	isTipVisible = () => {
		return !!(this.state || {}).showTip;
	};

	toggleTip = () => {
		this.setState({ showTip: !this.isTipVisible() });
	};

	render () {
		const {props: {colors, label, count, percent}} = this;

		const css = {
			width: `${percent}%`,
			background: colors[label]
		};

		const cls = cx('bar-series-segment', {
			'small': (percent < 8 && count > 19) || percent < 5
		});

		return (
			<div className={cls} style={css} data-count={count} onClick={this.toggleTip}>
				{count}
				{this.renderTooltip()}
			</div>
		);
	}

	renderTooltip = () => {
		const {props: {label, count, percent, total}} = this;
		if (!this.isTipVisible()) {
			return null;
		}

		const percentString = (percent || 0).toFixed(2);

		return (
			<div className="bar-tool-tip">
				<span {...rawContent(label)}/>
				<div>{count} of {total} ({percentString}%)</div>
			</div>
		);
	};
}
