import React from 'react';
import InputType from './Mixin';

import Content from '../Content';

import {Mixin, Draggable, DropTarget} from 'common/dnd';

const SetValueRaw = 'ordering:SetValueRaw';

/**
 * This input type represents Ordering
 */
export default React.createClass({
	displayName: 'Ordering',
	mixins: [InputType, Mixin],

	statics: {
		inputType: [
			'Ordering'
		]
	},


	propTypes: {
		item: React.PropTypes.object,
		value: React.PropTypes.any
	},


	getInitialState () {
		return {
			PartLocalDNDToken: 'default'
		};
	},


	getDefaultValue () {
		let values = (this.props.item || {}).labels || [];
		return Object.assign({}, values.map((_, i)=>i));
	},


	componentWillMount () {
		this.setState({
			PartLocalDNDToken: this.getNewUniqueToken(),
			value: this.props.value || this.getDefaultValue()
		});
	},


	getItemLabel (index) {
		return this.props.item.labels[index];
	},


	getItemValue (index) {
		return this.props.item.values[index];
	},


	onDrop (drop) {
		let value = Object.assign({}, this.getValue());
		let valueArray = this.getValueAsArray();
		let data = drop || {};
		let {source, target} = data;
		let swapFrom;

		if (source) {
			source = source.props['data-source'];
		}

		if (target) {
			target = target.props['data-target'];
		}

		if (target == null || source == null) {
			console.error('Missing target and/or source');
			throw new Error('Illegal State, there must be BOTH a source and a target');
		}

		swapFrom = valueArray.indexOf(source);
		if (swapFrom < 0) {
			console.error('Nothing to swap');
			throw new Error('Illegal State!');
		}

		console.debug(`Drop: %s (%s)
		onto %s (%s),
		swappingWith: %s (%s)`,

			this.getItemValue(source),
			source,
			target,
			this.getItemLabel(target),
			swapFrom,
			this.getItemLabel(swapFrom),
			value[swapFrom],
			this.getItemValue(value[swapFrom])
			);

		value[swapFrom] = value[target];

		value[target] = source;




		this[SetValueRaw](value);
	},


	render () {
		let dropTargets = this.props.item.labels || [];
		let submitted = this.isSubmitted();
		let solution = submitted && this.getSolution();

		return (
			<form className="ordering">
				{dropTargets.map((x, i)=>
					this.renderDropTarget(x, i, solution)
				)}
			</form>
		);
	},


	renderDropTarget (target, targetIndex, solution) {

		return (
			<DropTarget accepts={this.state.PartLocalDNDToken}
				className="match-row"
				key={targetIndex}
				data-target={targetIndex}>

				<Content className="cell ordinal" content={target}/>
				<div className="cell value">
					{this.renderDraggable(targetIndex, solution)}
				</div>

			</DropTarget>
		);
	},


	renderDraggable (targetIndex, solution) {
		let correct = '';
		let sources = this.props.item.values || [];
		let value = this.getValue();
		let sourceIndex = value[targetIndex];

		if (!value || sourceIndex < 0 || sourceIndex == null) {
			console.warn('THIS SHOULD NOT HAPPEN', value);
			return null;
		}

		if (solution && solution.value) {
			solution = solution.value;
			correct = solution[targetIndex] === sourceIndex ? 'correct' : 'incorrect';
		}

		return this.renderDragSource(sources[sourceIndex], sourceIndex, targetIndex, `dropped ${correct}`);
	},


	renderDragSource (source, sourceIndex, targetIndex, extraClass, lock) {
		let locked = this.isSubmitted() || Boolean(lock) || this.state.busy;
		let classes = ['order', 'source'];

		if (locked) {
			classes.push('locked');
		}

		if (extraClass) {
			classes.push(extraClass);
		}

		return (
			<Draggable
				axis="y"
				data-source={sourceIndex}
				constrain=""
				key={sourceIndex}
				locked={locked}
				type={this.state.PartLocalDNDToken}
				>
				<div className={classes.join(' ')} key={sourceIndex}>
					<Content content={source}/>
					<span className="hamburger small"><span/></span>
				</div>
			</Draggable>
		);
	},

	//The mixin implements @setValue(), but it just for external usage...when
	// we interact with this widget, and update the value state internally,
	// this will apply the state, and notify the store of the change.
	[SetValueRaw] (value) {
		let {length} = this.props.item.values;
		let array = Array.from(Object.assign({length: length}, value));

		if (value && Object.keys(value).length !== length) {
			value = null;
		}

		let seen = {};

		function notSeen (x) {
			let s = seen[x]; seen[x] = 1;
			return !s;
		}

		if (array.filter(x=> x != null && notSeen(x)).length !== length) {
			console.warn('Something went wrong. Preventing bad value from persisting. Here is the bad value:', value);
			return;
		}
		console.debug('Setting state: %o', value);
		this.setState({value: value}, this.handleInteraction);
	},


	getValue () {
		return this.state.value || this.getDefaultValue();
	},


	getValueAsArray () {
		let {length} = this.props.item.values;
		return Array.from(Object.assign({length: length}, this.getValue()));
	}
});
