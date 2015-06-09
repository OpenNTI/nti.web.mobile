import React from 'react';

import cx from 'classnames';
import hash from 'object-hash';

import {getEventTarget} from 'nti.lib.dom';

import NavigatableMixin from 'common/mixins/NavigatableMixin';

const pluck = (a, k) => a && a.map(x=> x[k]);

export default React.createClass({
	displayName: 'content:AnnotationGutter',
	mixins: [NavigatableMixin],

	propTypes: {
		items: React.PropTypes.object, //annotation dictionary {[obj.id]: obj}

		selectFilter: React.PropTypes.func
	},


	getDefaultProps () {
		return {
			selectFilter: () => {}
		};
	},


	getInitialState () {
		return {};
	},


	componentDidMount () {
		window.addEventListener('resize', this.handleResize);
		this.resolveBins(this.props.items);
		this.props.selectFilter(void 0);//reset
	},

	componentWillUnmount () {
		window.removeEventListener('resize', this.handleResize);
	},


	componentWillReceiveProps (nextProps) {
		this.resolveBins(nextProps.items);
	},


	handleResize () {
		this.setState({lines: {}}, ()=> this.resolveBins(this.props.items));
	},


	getLine (lines, line) {
		let lineTolerance = 40,
			bin = lines[line],
			lower = Math.round(line - (lineTolerance / 2)),
			upper = Math.round(line + (lineTolerance / 2));

		if (!bin) {
			for (let potentialLine of Object.keys(lines)) {
				potentialLine = parseInt(potentialLine, 10);
				if (potentialLine >= lower && potentialLine <= upper) {
					bin = lines[potentialLine];
					break;
				}
			}

			if (!bin) {
				bin = lines[line] = [];
			}
		}

		return bin;
	},


	resolveBins (items = {}) {
		let lines = {};

		for (let item of Object.values(items)) {

			let line = item.resolveVerticalLocation();

			if (line != null) {
				line = this.getLine(lines, line);
				if (!line.includes(item)) {
					line.push(item);
				}
			}
		}

		this.setState({lines});
	},


	getActiveBin (bin) {
		let {active, lines = {}} = this.state;

		if (bin) {
			active = bin;
		}

		if (!active) { return; }

		return Object.values(lines)
			.find(x=> active === hash(pluck(x, 'id')));
	},


	render () {
		// let items = this.getActiveBin() || Object.values(this.props.items || {});

		return (
			<div>
				{this.renderGutter()}
			</div>
		);
	},


	renderGutter () {
		let {lines = {}} = this.state;
		let linePositions = Object.keys(lines);
		return React.createElement('div', {className: 'gutter'},
				...linePositions.map(y => this.renderBin(y, lines[y])));
	},


	renderBin (y, bin) {
		let top = {top: `${y}px`};
		let count = (bin || []).length;
		let h = hash(pluck(bin, 'id'));
		let css = cx('bin', {
			active: this.state.active === h
		});

		count = count > 99 ? '99+' : count;

		let href = this.makeHref(`/discussions/`);

		return (
			<a data-line={h} href={href} style={top} className={css} onClick={this.onClick}>{count}</a>
		);
	},


	onClick (e) {
		let active = getEventTarget(e, 'a[data-line]');
		if (active) {
			active = active.getAttribute('data-line');
			if (active === this.state.active) {
				active = undefined;
			}
		}

		let bin = pluck(this.getActiveBin(active), 'id');
		this.setState({active});
		this.props.selectFilter(bin);
	}
});
