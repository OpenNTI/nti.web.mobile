import React from 'react';

import cx from 'classnames';
import hash from 'object-hash';

import {getEventTarget} from 'nti.lib.dom';

import Discussions from './Discussions';

const pluck = (a, k) => a.map(x=> x[k]);

export default React.createClass({
	displayName: 'content:AnnotationGutter',

	propTypes: {
		items: React.PropTypes.object,

		openGutterDrawer: React.PropTypes.func,
		closeGutterDrawer: React.PropTypes.func
	},

	getDefaultProps () {
		return {
			openGutterDrawer: ()=> {},
			closeGutterDrawer: ()=> {}
		};
	},


	getInitialState () {
		return {};
	},


	componentDidMount () {
		window.addEventListener('resize', this.handleResize);
		this.resolveBins(this.props.items);
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
		let {lines = {}} = this.state;

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


	getActiveBin () {
		let {active, lines = {}} = this.state;
		if (!active) { return; }

		return Object.values(lines)
			.find(x=> active === hash(pluck(x, 'id')));
	},


	render () {
		let items = this.getActiveBin() || Object.values(this.props.items || {});

		return (
			<div>
				{this.renderGutter()}
				<Discussions items={items}/>
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

		return (
			<a data-line={h} href="#" style={top} className={css} onClick={this.onClick}>{count}</a>
		);
	},


	onClick (e) {
		e.preventDefault();
		e.stopPropagation();

		let {openGutterDrawer, closeGutterDrawer} = this.props;

		let active = getEventTarget(e, 'a[data-line]');
		if (active) {
			active = active.getAttribute('data-line');
			if (active === this.state.active) {
				active = undefined;
			}
		}

		this.setState({active});

		if (active) {
			openGutterDrawer();
		} else {
			closeGutterDrawer();
		}
	}
});
