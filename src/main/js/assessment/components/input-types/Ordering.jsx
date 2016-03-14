import React from 'react';

import Logger from 'nti-util-logger';

import {Mixin, Draggable, DropTarget} from 'common/dnd';

import Content from '../Content';

import InputType, {stopEvent} from './Mixin';

const logger = Logger.get('assessment:components:input-types:Ordering');

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
		item: React.PropTypes.object
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
			PartLocalDNDToken: this.getNewUniqueToken()
		});
	},


	getItemLabel (index) {
		return this.props.item.labels[index];
	},


	getItemValue (index) {
		return this.props.item.values[index];
	},


	onDrop (drop) {
		let value = this.getValueAsArray();
		let data = drop || {};
		let {source, target} = data;

		if (source) {
			source = source.props['data-source'];
		}

		if (target) {
			target = target.props['data-target'];
		}

		if (target == null || source == null) {
			logger.error('Missing target and/or source');
			throw new Error('Illegal State, there must be BOTH a source and a target');
		}

		let oldPosition = value.indexOf(source);
		if (oldPosition < 0) {
			throw new Error('Illegal State!');
		}

		value[oldPosition] = null;
		value.splice(target, 0, source);


		const raw = {};
		value.filter(x => x !== null).map((v,k) => raw[k] = v);
		this[SetValueRaw](raw);
	},


	render () {
		let dropTargets = this.props.item.labels || [];
		let solution = this.isAssessed() && this.getSolution();

		return (
			<form className="ordering" onSubmit={stopEvent}>
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
			logger.warn('THIS SHOULD NOT HAPPEN', value);
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
			logger.warn('Something went wrong. Preventing bad value from persisting. Here is the bad value:', value);
			return;
		}
		logger.debug('Setting state: %o', value);
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
