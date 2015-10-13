import React from 'react';
import cx from 'classnames';


export default React.createClass({
	displayName: 'BarSegment',

	propTypes: {
		colors: React.PropTypes.object,
		label: React.PropTypes.string,
		count: React.PropTypes.number,
		percent: React.PropTypes.number,
		total: React.PropTypes.number
	},

	isTipVisible () {
		return !!(this.state || {}).showTip;
	},


	toggleTip () {
		this.setState({ showTip: !this.isTipVisible() });
	},


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
	},


	renderTooltip () {
		const {props: {label, count, percent, total}} = this;
		if (!this.isTipVisible()) {
			return null;
		}

		const percentString = (percent || 0).toFixed(2);

		return (
			<div className="bar-tool-tip">
				<span>{label}</span>
				<div>{count} of {total} ({percentString}%)</div>
			</div>
		);
	}
});
