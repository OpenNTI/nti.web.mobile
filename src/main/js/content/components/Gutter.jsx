import './Gutter.scss';
import { join } from 'path';

import PropTypes from 'prop-types';
import cx from 'classnames';
import createReactClass from 'create-react-class';
import hash from 'object-hash';

import { getEventTarget } from '@nti/lib-dom';
import { Mixins } from '@nti/web-commons';

import { RETRY_AFTER_DOM_SETTLES } from './annotations/Annotation';

const pluck = (a, k) => a && a.map(x => x[k]);

export default createReactClass({
	displayName: 'content:AnnotationGutter',
	mixins: [Mixins.NavigatableMixin],

	propTypes: {
		items: PropTypes.object, //annotation dictionary {[obj.id]: obj}

		selectFilter: PropTypes.func,

		prefix: PropTypes.string,
	},

	getDefaultProps() {
		return {
			prefix: '/',
			selectFilter: () => {},
		};
	},

	getInitialState() {
		return {};
	},

	componentDidMount() {
		window.addEventListener('resize', this.handleContentUpdate);
		this.resolveBins(this.props.items);
		this.props.selectFilter(void 0); //reset
	},

	componentWillUnmount() {
		clearTimeout(this.state.resolveRetryDelay);
		window.removeEventListener('resize', this.handleContentUpdate);
	},

	componentDidUpdate(prevProps) {
		const { items } = this.props;
		if (prevProps.items !== items) {
			this.resolveBins(items);
		}
	},

	handleContentUpdate() {
		this.setState({ lines: {} }, () => this.resolveBins(this.props.items));
	},

	getLine(lines, line) {
		let lineTolerance = 40,
			bin = lines[line],
			lower = Math.round(line - lineTolerance / 2),
			upper = Math.round(line + lineTolerance / 2);

		if (!bin) {
			for (let lineKey of Object.keys(lines)) {
				let potentialLine = parseInt(lineKey, 10);
				if (potentialLine >= lower && potentialLine <= upper) {
					bin = lines[lineKey];
					break;
				}
			}

			if (!bin) {
				bin = lines[line] = [];
			}
		}

		return bin;
	},

	resolveBins(items) {
		let lines = {};
		let shouldRetry = false;
		let { resolveRetryDelay } = this.state;

		if (resolveRetryDelay != null) {
			clearTimeout(resolveRetryDelay);
			resolveRetryDelay = void 0;
		}

		if (!items) {
			return;
		}

		// console.debug('Resolving Bins');
		for (let item of Object.values(items)) {
			if (!item) {
				continue;
			}

			let line = item.resolveVerticalLocation();
			if (line === RETRY_AFTER_DOM_SETTLES) {
				shouldRetry = true;
				break;
			}

			if (line != null) {
				line = this.getLine(lines, line);
				if (!line.includes(item)) {
					line.push(item);
				}
			}
		}

		if (shouldRetry) {
			resolveRetryDelay = setTimeout(() => this.resolveBins(items), 200);
			lines = {};
		}

		this.setState({ lines, resolveRetryDelay });
	},

	getActiveBin(bin) {
		let { active, lines = {} } = this.state;

		if (bin) {
			active = bin;
		}

		if (!active) {
			return;
		}

		return Object.values(lines).find(x => active === hash(pluck(x, 'id')));
	},

	render() {
		let { lines = {} } = this.state;
		let linePositions = Object.keys(lines);
		return (
			<div className="gutter">
				{linePositions.map(y => this.renderBin(y, lines[y]))}
			</div>
		);
	},

	renderBin(y, bin) {
		let top = { top: `${y}px` };
		let count = (bin || []).length;
		let h = hash(pluck(bin, 'id'));
		let css = cx('bin', {
			active: this.state.active === h,
		});

		count = count > 99 ? '99+' : count;

		let href = this.makeHref(join('/', this.props.prefix, '/discussions/'));

		return (
			<a
				key={y}
				data-line={h}
				href={href}
				style={top}
				className={css}
				onClick={this.onClick}
			>
				{count}
			</a>
		);
	},

	onClick(e) {
		let active = getEventTarget(e, 'a[data-line]');
		if (active) {
			active = active.getAttribute('data-line');
			if (active === this.state.active) {
				active = undefined;
			}
		}

		let bin = pluck(this.getActiveBin(active), 'id');
		this.setState({ active });
		this.props.selectFilter(bin);
	},
});
