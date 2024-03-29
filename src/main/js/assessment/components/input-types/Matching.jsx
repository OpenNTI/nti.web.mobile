import './Matching.scss';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';

import { getEventTarget } from '@nti/lib-dom';
//import { isEmpty } from '@nti/lib-commons';
import { Mixin, Draggable, DropTarget } from 'internal/common/dnd';

import Content from '../Content';

import InputType, { stopEvent } from './Mixin';

const SetValueRaw = 'matching:SetValueRaw';

/**
 * This input type represents Matching
 */
export default createReactClass({
	displayName: 'Matching',
	mixins: [InputType, Mixin],

	statics: {
		inputType: ['Matching'],
	},

	propTypes: {
		item: PropTypes.object,
	},

	getInitialState() {
		return {
			PartLocalDNDToken: 'default',
		};
	},

	componentDidMount() {
		this.setState({
			PartLocalDNDToken: this.getNewUniqueToken(),
		});
	},

	onDrop(drop) {
		let value = { ...(this.state.value || {}) };
		let data = drop || {};
		let { source, target } = data;

		if (source) {
			source = source.props['data-source'];
		}

		if (target) {
			target = target.props['data-target'];
		}

		// The ONLY time that the '==' (double equals) operator is acceptable... testing for null
		// (which will evaluate to true for `null` and `undefined` but false for everything else)
		if (target == null || source == null) {
			throw new Error(
				'Illegal State, there must be BOTH a source and a target'
			);
		}

		Object.keys(value).forEach(x => {
			if (value[x] === target) {
				delete value[x];
			}
		});

		value[source] = target;
		this[SetValueRaw](value);
	},

	onDragReset(e) {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}

		function get(sel, attr) {
			let o = getEventTarget(e, `${sel}[${attr}]`);
			o = o && o.getAttribute(attr);
			//the double equals is intentional here.
			return o == null ? null : parseInt(o, 10);
		}

		let source = get('.source', 'data-source');
		//let target = get('.target', 'data-target');

		let val = { ...(this.state.value || {}) };

		delete val[source];
		this[SetValueRaw](val);
	},

	[SetValueRaw](value) {
		if (value && Object.keys(value).length === 0) {
			value = null;
		}

		this.setState({ value: value }, this.handleInteraction);
	},

	render() {
		let dragSources = this.props.item.labels || [];
		let dropTargets = this.props.item.values || [];
		let submitted = this.isSubmitted();
		let solution = submitted && this.getSolution();

		let isUsed = i =>
			Object.prototype.hasOwnProperty.call(this.state.value || {}, i);

		return (
			<div className="matching">
				<div className="terms">
					{dragSources.map((x, i) =>
						this.renderDragSource(
							x,
							i,
							isUsed(i) ? 'used' : '',
							isUsed(i)
						)
					)}
				</div>

				<form className="box" onSubmit={stopEvent}>
					{dropTargets.map((x, i) =>
						this.renderDropTarget(x, i, solution)
					)}
				</form>
			</div>
		);
	},

	renderDropTarget(target, targetIndex, solution) {
		return (
			<DropTarget
				accepts={this.state.PartLocalDNDToken}
				className="drop target"
				key={targetIndex}
				data-target={targetIndex}
			>
				<input type="hidden" />
				<div className="match blank dropzone" data-dnd>
					{this.renderDroppedDragSource(targetIndex, solution)}
				</div>
				<Content className="content" content={target} />
			</DropTarget>
		);
	},

	renderDroppedDragSource(targetIndex, solution) {
		let sources = this.props.item.labels || [];
		let value = Array.from({
			length: sources.length,
			...(this.state.value || {}),
		});
		let correct = '';

		// we are seeing string values (of numbers) so we shouldn't assume the array is already numeric
		const coercedValue = [...(value || [])].map(x => parseInt(x, 10));

		let dragSourceIndex = coercedValue.indexOf(targetIndex);

		if (dragSourceIndex < 0) {
			return null;
		}

		if (solution && solution.value) {
			solution = solution.value;

			correct =
				solution[dragSourceIndex] === targetIndex
					? 'correct'
					: 'incorrect';
		}

		return this.renderDragSource(
			sources[dragSourceIndex],
			dragSourceIndex,
			'dropped ' + correct
		);
	},

	renderDragSource(term, sourceIndex, extraClass, lock) {
		let locked = this.isSubmitted() || Boolean(lock);
		let classes = ['drag', 'match', 'source'];
		if (locked) {
			classes.push('locked');
		}

		if (extraClass) {
			classes.push(extraClass);
		}

		return (
			<Draggable
				cancel=".reset"
				data-source={sourceIndex}
				key={sourceIndex}
				locked={locked}
				type={this.state.PartLocalDNDToken}
			>
				<div
					className={classes.join(' ')}
					key={sourceIndex}
					data-source={sourceIndex}
				>
					{!locked && (
						<a
							href="#"
							className="reset"
							title="Reset"
							onClick={this.onDragReset}
						/>
					)}
					<Content content={term} />
				</div>
			</Draggable>
		);
	},

	getValue() {
		return this.state.value;
	},
});
